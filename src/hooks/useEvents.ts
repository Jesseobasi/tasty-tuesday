'use client';

import { useQuery } from '@tanstack/react-query';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { eventsCol } from '../firebase/collections';
import { Event } from '../utils/types';

export const useEvents = (includeInactive = false) => {
  return useQuery<Event[]>({
    queryKey: ['events', includeInactive],
    queryFn: async () => {
      const q = includeInactive
        ? query(eventsCol, orderBy('date', 'asc'))
        : query(eventsCol, where('isActive', '==', true), orderBy('date', 'asc'));

      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Event) }));
    },
  });
};
