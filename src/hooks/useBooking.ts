'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDocs, query, where } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { bookingsCol } from '../firebase/collections';
import { functions } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { Booking } from '../utils/types';

export const useBooking = () => {
  const { user } = useAuth();
  const qc = useQueryClient();

  const bookingQuery = useQuery<Booking | null>({
    queryKey: ['booking', user?.uid],
    queryFn: async () => {
      if (!user) return null;
      const snap = await getDocs(query(bookingsCol, where('userId', '==', user.uid), where('status', '==', 'confirmed')));
      if (snap.empty) return null;
      const doc = snap.docs[0];
      return { id: doc.id, ...(doc.data() as Booking) };
    },
    enabled: !!user,
  });

  const createBooking = useMutation({
    mutationFn: async ({ eventId }: { eventId: string }) => {
      const callable = httpsCallable(functions, 'createBooking');
      await callable({ eventId });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['booking'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async () => {
      const callable = httpsCallable(functions, 'cancelBooking');
      await callable({});
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['booking'] });
      qc.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return { ...bookingQuery, createBooking, cancelBooking };
};
