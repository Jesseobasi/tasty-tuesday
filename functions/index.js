const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const { format } = require('date-fns');

admin.initializeApp();
const db = admin.firestore();

// Configure SendGrid if key exists
const sendgridKey = functions.config().sendgrid && functions.config().sendgrid.key;
if (sendgridKey) {
  sgMail.setApiKey(sendgridKey);
}

const sendEmail = async ({ to, subject, html }) => {
  if (!sendgridKey) return; // silently skip if not configured
  const msg = {
    to,
    from: 'hello@tastytuesday.com',
    subject,
    html,
  };
  await sgMail.send(msg);
};

const toJSDate = (dateLike) => {
  if (!dateLike) return new Date();
  if (typeof dateLike.toDate === 'function') return dateLike.toDate();
  return new Date(dateLike);
};

const bookingEmailTemplate = (_booking, event) => `
  <div style="font-family:Inter,Helvetica,sans-serif;padding:24px;color:#111;background:#f7f5f2;">
    <h2 style="margin:0 0 12px 0;">Your Tasty Tuesday booking is confirmed</h2>
    <p>Hi there! You're booked for <strong>${event.title}</strong>.</p>
    <p><strong>Date:</strong> ${format(toJSDate(event.date), 'EEEE, MMM d, yyyy p')}</p>
    <p><strong>Location:</strong> Shared after confirmation</p>
    <p>One seat per guest. If you need to cancel, visit your dashboard.</p>
    <p style="margin-top:24px;color:#666;">See you soon,<br/>Tasty Tuesday Crew</p>
  </div>
`;

const reminderEmailTemplate = (_booking, event) => `
  <div style="font-family:Inter,Helvetica,sans-serif;padding:24px;color:#111;background:#f7f5f2;">
    <h2 style="margin:0 0 12px 0;">Reminder: Tasty Tuesday is tomorrow</h2>
    <p>You booked <strong>${event.title}</strong>.</p>
    <p><strong>Date:</strong> ${format(toJSDate(event.date), 'EEEE, MMM d, yyyy p')}</p>
    <p>Reply to this email if you need help. One seat per guest.</p>
    <p style="margin-top:24px;color:#666;">Warmly,<br/>Tasty Tuesday</p>
  </div>
`;

exports.createBooking = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Please log in.');
  const userId = context.auth.uid;
  const userEmail = context.auth.token.email;
  const { eventId } = data;
  if (!eventId) throw new functions.https.HttpsError('invalid-argument', 'eventId is required');

  const { bookingId, event } = await db.runTransaction(async (tx) => {
    // Check active booking for this user
    const existingSnap = await tx.get(
      db.collection('bookings').where('userId', '==', userId).where('status', '==', 'confirmed').limit(1)
    );
    if (!existingSnap.empty) {
      throw new functions.https.HttpsError('failed-precondition', 'You already have a booking.');
    }

    const eventRef = db.collection('events').doc(eventId);
    const eventSnap = await tx.get(eventRef);
    if (!eventSnap.exists) throw new functions.https.HttpsError('not-found', 'Event not found');
    const eventData = eventSnap.data();
    if (!eventData.isActive) throw new functions.https.HttpsError('failed-precondition', 'Event not active');
    if (eventData.seatsAvailable <= 0) throw new functions.https.HttpsError('failed-precondition', 'Event is full');

    tx.update(eventRef, { seatsAvailable: eventData.seatsAvailable - 1 });
    const bookingRef = db.collection('bookings').doc();
    const bookingData = {
      userId,
      userEmail,
      eventId,
      status: 'confirmed',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
    tx.set(bookingRef, bookingData);

    return { bookingId: bookingRef.id, event: eventData };
  });

  // Send confirmation email after transaction
  try {
    if (event && userEmail) {
      await sendEmail({
        to: userEmail,
        subject: 'Your Tasty Tuesday booking is confirmed',
        html: bookingEmailTemplate({}, event),
      });
    }
  } catch (e) {
    console.error('Email send failed', e);
  }

  return { bookingId };
});

exports.cancelBooking = functions.https.onCall(async (_data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Please log in.');
  const userId = context.auth.uid;

  return db.runTransaction(async (tx) => {
    const bookingSnap = await tx.get(
      db.collection('bookings').where('userId', '==', userId).where('status', '==', 'confirmed').limit(1)
    );
    if (bookingSnap.empty) throw new functions.https.HttpsError('not-found', 'No booking to cancel');
    const bookingDoc = bookingSnap.docs[0];
    const booking = bookingDoc.data();

    const eventRef = db.collection('events').doc(booking.eventId);
    const eventSnap = await tx.get(eventRef);
    if (eventSnap.exists) {
      const event = eventSnap.data();
      const newSeats = Math.min((event.seatsAvailable || 0) + 1, event.seatsTotal || 0);
      tx.update(eventRef, { seatsAvailable: newSeats });
    }

    tx.update(bookingDoc.ref, { status: 'cancelled', cancelledAt: admin.firestore.FieldValue.serverTimestamp() });
    return { cancelled: true };
  });
});

const assertAdmin = (context) => {
  if (!context.auth || context.auth.token.admin !== true) {
    throw new functions.https.HttpsError('permission-denied', 'Admin only');
  }
};

exports.adminCreateEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);
  const payload = data;
  if (!payload.title || !payload.date) throw new functions.https.HttpsError('invalid-argument', 'Title and date required');
  const seatsTotal = Number(payload.seatsTotal || 0);
  if (seatsTotal <= 0) throw new functions.https.HttpsError('invalid-argument', 'Seats must be positive');
  const doc = {
    title: payload.title,
    date: new Date(payload.date),
    description: payload.description || '',
    pricingTiers: payload.pricingTiers || [],
    seatsTotal,
    seatsAvailable: payload.seatsAvailable ?? seatsTotal,
    isActive: payload.isActive !== false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await db.collection('events').add(doc);
  return { created: true };
});

exports.adminUpdateEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);
  const { id, ...rest } = data;
  if (!id) throw new functions.https.HttpsError('invalid-argument', 'id required');
  const ref = db.collection('events').doc(id);
  const snap = await ref.get();
  if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Event not found');

  const update = { ...rest };
  if (rest.date) update.date = new Date(rest.date);
  if (rest.seatsTotal) {
    const current = snap.data();
    const seatsBooked = (current.seatsTotal || 0) - (current.seatsAvailable || 0);
    const newAvailable = Math.max(0, rest.seatsTotal - seatsBooked);
    update.seatsTotal = rest.seatsTotal;
    update.seatsAvailable = newAvailable;
  }
  await ref.update(update);
  return { updated: true };
});

exports.adminCancelBooking = functions.https.onCall(async (data, context) => {
  assertAdmin(context);
  const { bookingId } = data;
  if (!bookingId) throw new functions.https.HttpsError('invalid-argument', 'bookingId required');

  return db.runTransaction(async (tx) => {
    const bookingRef = db.collection('bookings').doc(bookingId);
    const bookingSnap = await tx.get(bookingRef);
    if (!bookingSnap.exists) throw new functions.https.HttpsError('not-found', 'Booking not found');
    const booking = bookingSnap.data();
    if (booking.status === 'cancelled') return { cancelled: true };

    const eventRef = db.collection('events').doc(booking.eventId);
    const eventSnap = await tx.get(eventRef);
    if (eventSnap.exists) {
      const event = eventSnap.data();
      const seatsBooked = (event.seatsTotal || 0) - (event.seatsAvailable || 0);
      const newAvailable = Math.max(0, Math.min(event.seatsTotal || 0, event.seatsAvailable + 1));
      // simple increment bounded by total
      tx.update(eventRef, { seatsAvailable: newAvailable });
    }

    tx.update(bookingRef, { status: 'cancelled', cancelledAt: admin.firestore.FieldValue.serverTimestamp() });
    return { cancelled: true };
  });
});

exports.adminDeleteEvent = functions.https.onCall(async (data, context) => {
  assertAdmin(context);
  const { id } = data;
  if (!id) throw new functions.https.HttpsError('invalid-argument', 'id required');
  await db.collection('events').doc(id).delete();
  return { deleted: true };
});

exports.sendReminders = functions.pubsub.schedule('every 60 minutes').timeZone('Etc/UTC').onRun(async () => {
  if (!sendgridKey) return null;
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in25h = new Date(now.getTime() + 25 * 60 * 60 * 1000);
  const eventsSnap = await db
    .collection('events')
    .where('date', '>=', now)
    .where('date', '<=', in25h)
    .get();

  const reminders = [];
  for (const doc of eventsSnap.docs) {
    const event = doc.data();
    const eventDate = toJSDate(event.date);
    if (!eventDate) continue;
    if (eventDate < in24h) continue; // within 24h window
    const bookingsSnap = await db
      .collection('bookings')
      .where('eventId', '==', doc.id)
      .where('status', '==', 'confirmed')
      .get();
    bookingsSnap.forEach((b) => {
      const booking = b.data();
      if (booking.userEmail) {
        reminders.push(
          sendEmail({
            to: booking.userEmail,
            subject: 'Reminder: your Tasty Tuesday is tomorrow',
            html: reminderEmailTemplate(booking, event),
          })
        );
      }
    });
  }
  await Promise.all(reminders);
  return null;
});
