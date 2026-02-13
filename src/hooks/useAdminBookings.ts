'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getDocs, orderBy, query } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { bookingsCol } from '../firebase/collections';
import { functions } from '../firebase/config';
import { Booking } from '../utils/types';

export const useAdminBookings = () => {
  const qc = useQueryClient();

  const bookingsQuery = useQuery<Booking[]>(['admin-bookings'], async () => {
    const snap = await getDocs(query(bookingsCol, orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Booking) }));
  });

  const cancelBooking = useMutation(
    async (bookingId: string) => {
      const callable = httpsCallable(functions, 'adminCancelBooking');
      await callable({ bookingId });
    },
    { onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-bookings'] }) }
  );

  return { ...bookingsQuery, cancelBooking };
};
