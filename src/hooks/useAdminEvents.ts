'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';
import { Event } from '../utils/types';

export const useAdminEvents = () => {
  const qc = useQueryClient();

  const refresh = () => qc.invalidateQueries({ queryKey: ['events'] });

  const createEvent = useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'seatsAvailable'>) => {
      const callable = httpsCallable(functions, 'adminCreateEvent');
      await callable(event);
    },
    onSuccess: refresh,
  });

  const updateEvent = useMutation({
    mutationFn: async (payload: Partial<Event> & { id: string }) => {
      const callable = httpsCallable(functions, 'adminUpdateEvent');
      await callable(payload);
    },
    onSuccess: refresh,
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const callable = httpsCallable(functions, 'adminDeleteEvent');
      await callable({ id });
    },
    onSuccess: refresh,
  });

  return { createEvent, updateEvent, deleteEvent };
};
