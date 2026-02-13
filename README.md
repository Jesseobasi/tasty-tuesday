# Tasty Tuesday

Modern, cozy cooking-event booking app. Built with Next.js 14 (App Router), Tailwind, Firebase Auth/Firestore/Functions, and React Query.

## Stack & Architecture
- **UI**: Next.js (App Router) + TypeScript + Tailwind + Headless UI. Client components for authenticated flows.
- **State**: AuthContext (Firebase Auth) + React Query for Firestore/Functions data.
- **Data**: Firestore collections
  - `events`: title, date (Timestamp), description, pricingTiers[], seatsTotal, seatsAvailable, isActive, createdAt
  - `bookings`: userId, userEmail, eventId, status, createdAt, cancelledAt
  - `users`: profile docs (optional), claims managed via custom claims
- **APIs**: Firebase Cloud Functions (callable) for booking, cancellation, admin event CRUD, and hourly reminder dispatcher.
- **Hosting**: Firebase Hosting with frameworks backend (Next SSR) in `us-central1`.
- **Email**: SendGrid via Functions config (`sendgrid.key`).

## File layout
- `src/app` — App Router pages (`page.tsx`, `events/`, `dashboard/`, `admin/`, `auth/`)
- `src/components` — UI primitives (`Card`, `Button`, `Skeleton`, `Spinner`) and layout (`Navbar`, `Footer`, `LayoutShell`, route guards)
- `src/context` — `AuthContext`, `Providers` (QueryClient + Auth)
- `src/hooks` — `useEvents`, `useBooking`, `useAdminEvents`
- `src/firebase` — client config + collection helpers
- `src/utils` — shared types
- `functions/` — Cloud Functions (booking, cancellation, admin CRUD, reminders)
- `firestore.rules` — security rules
- `firestore.indexes.json` — composite index for `events` by `isActive`+`date`

## Environment
Copy `.env.example` to `.env.local` and adjust if you rotate keys:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCnuR1PcvmoScKhVmTXB9eOxY7gRbjmJNk
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tasty-tuesday-6cd5a.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tasty-tuesday-6cd5a
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tasty-tuesday-6cd5a.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=623553068778
NEXT_PUBLIC_FIREBASE_APP_ID=1:623553068778:web:13444027c17c6560922193
NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION=us-central1
```

## Firebase setup
1) `firebase login` and select project `tasty-tuesday-6cd5a`.
2) Enable **Email/Password** auth in the console.
3) Firestore rules: `firebase deploy --only firestore:rules` using `firestore.rules`.
4) Indexes: `firebase deploy --only firestore:indexes` (adds isActive+date index for events and userId+status index for bookings).
5) Storage rules (optional, currently read-only): `firebase deploy --only storage`.

## Cloud Functions
- Located in `functions/index.js` (Node 18 runtime).
- Callable functions:
  - `createBooking(eventId)`: transactionally enforce one booking per user, decrement seats, store userEmail, send confirmation email.
  - `cancelBooking()`: marks booking cancelled and re-adds a seat.
  - `adminCreateEvent`, `adminUpdateEvent`, `adminDeleteEvent`: admin-only CRUD for events.
  - `adminCancelBooking(bookingId)`: admin-only cancellation to free a seat.
- Scheduled function:
  - `sendReminders`: runs hourly; emails bookings for events occurring ~24 hours out.

### Configure email (SendGrid)
```
firebase functions:config:set sendgrid.key="<YOUR_SENDGRID_API_KEY>"
```
Deploy functions after setting config: `firebase deploy --only functions`.

## Admin role assignment
Use Firebase Admin to set the custom claim on the desired user (e.g., `jesseobasi@gmail.com`):
```bash
# From functions/ folder (requires service account or emulator admin privileges)
node -e "const admin=require('firebase-admin');admin.initializeApp();admin.auth().getUserByEmail('jesseobasi@gmail.com').then(u=>admin.auth().setCustomUserClaims(u.uid,{admin:true})).then(()=>console.log('Admin set'));"
```
Sign out/in to refresh ID token so the claim is picked up in the UI.

## Running locally
```bash
npm install        # first time
npm run dev        # http://localhost:3000
```
(If npm install fails offline, rerun when network is available.)

## Deployment
```
npm run build              # Next build
firebase deploy --only hosting,functions,firestore:indexes,firestore:rules
```
Firebase Hosting uses the frameworks backend for SSR; ensure `firebase experiments:enable webframeworks` is on if prompted.

## Booking & security model
- One booking per authenticated user enforced in `createBooking` transaction.
- Seat counts decremented/incremented transactionally; client cannot write seats directly.
- Firestore rules:
  - `events` read-only to everyone; writes admin-only.
  - `bookings` readable/deletable only by owner; creates blocked client-side (functions only).
  - `users` docs scoped to owner.

## UI notes
- Warm minimal palette (black/white base, accent pink `#f472b6`).
- Responsive navbar with mobile drawer, soft shadows, rounded cards, skeleton loaders.
- Light/dark theme toggle with persisted preference.
- Landing hero includes placeholder promo video — replace iframe src when you have the final link.
- Logo: drop your asset into `public/` and update the `Navbar` avatar if desired.

## Future work
- Hook up real payment confirmation flow if needed.
- Add richer event images/gallery per event.
- Add rate limiting or reCAPTCHA on auth forms if abuse is a concern.
