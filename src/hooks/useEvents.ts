'use client';

import { useQuery } from '@tanstack/react-query';
import { getDocs, orderBy, query, where } from 'firebase/firestore';
import { eventsCol } from '../firebase/collections';
import { Event } from '../utils/types';

const demoEvents = (): Event[] => {
  const now = new Date();
  const mkDate = (offsetDays: number) => new Date(now.getTime() + offsetDays * 86400000).toISOString();
  return [
    {
      id: 'demo-1',
      title: 'Cozy Pasta Night',
      date: mkDate(3),
      description: 'Handmade pasta, film lights, and warm pink glow.',
      pricingTiers: [
        { name: 'General', price: 45 },
        { name: "Chef's Table", price: 65 },
      ],
      seatsTotal: 12,
      seatsAvailable: 4,
      isActive: true,
    },
    {
      id: 'demo-2',
      title: 'Street Food Feast',
      date: mkDate(10),
      description: 'Skewers, sauces, and stories. One booking per guest.',
      pricingTiers: [{ name: 'General', price: 40 }],
      seatsTotal: 16,
      seatsAvailable: 9,
      isActive: true,
    },
  ];
};

export const useEvents = (includeInactive = false) => {
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  return useQuery<Event[]>({
    queryKey: ['events', includeInactive],
    queryFn: async () => {
      const q = includeInactive
        ? query(eventsCol, orderBy('date', 'asc'))
        : query(eventsCol, where('isActive', '==', true), orderBy('date', 'asc'));

      const snap = await getDocs(q);
      const rows = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Event) }));
      if (rows.length === 0 && demo) return demoEvents();
      return rows;
    },
  });
};
