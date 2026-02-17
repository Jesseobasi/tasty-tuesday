'use client';

import { useQuery } from '@tanstack/react-query';

export type FormResponse = Record<string, string>;

const demoResponses: FormResponse[] = [
  { Timestamp: '2/17/2026 09:15:00', Name: 'Ava Demo', Email: 'ava@example.com', Guests: '1', Allergies: 'None' },
  { Timestamp: '2/17/2026 10:02:00', Name: 'Liam Demo', Email: 'liam@example.com', Guests: '2', Allergies: 'Peanuts' },
];

export const useFormResponses = () => {
  const demo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
  return useQuery<FormResponse[]>({
    queryKey: ['form-responses'],
    queryFn: async () => {
      const res = await fetch('/api/forms');
      if (!res.ok) {
        if (demo) return demoResponses;
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load form responses');
      }
      const json = await res.json();
      const rows = json.responses as FormResponse[];
      if ((!rows || rows.length === 0) && demo) return demoResponses;
      return rows;
    },
  });
};
