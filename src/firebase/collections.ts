import { collection, doc } from 'firebase/firestore';
import { db } from './config';

export const eventsCol = collection(db, 'events');
export const eventDoc = (id: string) => doc(db, 'events', id);
export const bookingsCol = collection(db, 'bookings');
export const bookingDoc = (id: string) => doc(db, 'bookings', id);
export const usersCol = collection(db, 'users');
export const userDoc = (id: string) => doc(db, 'users', id);
