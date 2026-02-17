'use client';

import { ProtectedRoute } from '../../components/layout/ProtectedRoute';
import { useBooking } from '../../hooks/useBooking';
import { useEvents } from '../../hooks/useEvents';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { format } from 'date-fns';
import { useState } from 'react';

export default function DashboardPage() {
  const { data: booking, isLoading, cancelBooking } = useBooking();
  const { data: events } = useEvents(true);
  const [error, setError] = useState('');

  const bookedEvent = events?.find((e) => e.id === booking?.eventId);
  const asDate = (input: any) => {
    if (!input) return new Date();
    if (typeof input.toDate === 'function') return input.toDate();
    return new Date(input);
  };

  return (
    <ProtectedRoute>
      <div className="container-responsive space-y-6 py-12">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">Dashboard</p>
          <h1 className="text-3xl font-bold text-offwhite">Your booking</h1>
          <p className="text-sm text-neutral-400">One seat per guest. Manage it here.</p>
        </div>

        {isLoading && (
          <Card className="space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/4" />
          </Card>
        )}

        {!isLoading && !booking && (
          <Card className="space-y-2">
            <h3 className="text-lg font-semibold text-offwhite">No booking yet</h3>
            <p className="text-sm text-neutral-400">Pick an event and reserve your spot.</p>
            <Button onClick={() => (window.location.href = '/events')}>Book an event</Button>
          </Card>
        )}

        {booking && bookedEvent && (
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">{bookedEvent.title}</h3>
                <p className="text-sm text-neutral-400">{format(asDate(bookedEvent.date), 'EEEE, MMM d, yyyy')}</p>
                <p className="text-sm text-neutral-400">Status: {booking.status}</p>
              </div>
              <span className="pill">
                Seats left: {bookedEvent.seatsAvailable}
              </span>
            </div>
            <Button
              variant="secondary"
              onClick={() =>
                cancelBooking.mutate(undefined, {
                  onError: (err: any) => setError(err?.message || 'Cancellation failed'),
                  onSuccess: () => setError(''),
                })
              }
              loading={cancelBooking.isPending}
            >
              Cancel booking
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}
