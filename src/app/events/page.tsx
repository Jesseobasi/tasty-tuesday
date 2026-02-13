'use client';

import { useAuth } from '../../context/AuthContext';
import { useBooking } from '../../hooks/useBooking';
import { useEvents } from '../../hooks/useEvents';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

export default function EventsPage() {
  const { data: events, isLoading } = useEvents();
  const { data: booking, isLoading: bookingLoading, createBooking } = useBooking();
  const { user } = useAuth();
  const [error, setError] = useState('');

  const asDate = (input: any) => {
    if (!input) return new Date();
    if (typeof input.toDate === 'function') return input.toDate();
    return new Date(input);
  };

  const handleBook = (eventId: string) => {
    if (!user) {
      window.location.href = '/auth/login';
      return;
    }
    setError('');
    createBooking.mutate({ eventId }, { onError: (err: any) => setError(err?.message || 'Booking failed') });
  };

  return (
    <div className="container-responsive space-y-8 py-12">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-muted">Events</p>
        <h1 className="text-3xl font-bold">Choose your Tasty Tuesday</h1>
        <p className="text-sm text-neutral-600">One booking per guest. Seats are limited.</p>
      </div>

      {(isLoading || bookingLoading) && (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="space-y-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      )}

      {!isLoading && events && events.length === 0 && <p>No events yet. Check back soon.</p>}

      <div className="grid gap-6 md:grid-cols-2">
        {events?.map((event) => {
          const isFull = event.seatsAvailable <= 0;
          const alreadyBooked = !!booking;
          const disabled = isFull || alreadyBooked;
          return (
            <Card key={event.id} className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-neutral-600">{event.description}</p>
                  <p className="text-sm font-medium">{format(asDate(event.date), 'EEEE, MMM d, yyyy')}</p>
                </div>
                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700">
                  {event.seatsAvailable} / {event.seatsTotal} seats
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-neutral-700">
                {event.pricingTiers.map((tier) => (
                  <span key={tier.name} className="rounded-full bg-neutral-100 px-3 py-1">
                    {tier.name}: ${tier.price}
                  </span>
                ))}
              </div>
              <Button disabled={disabled} loading={createBooking.isPending} onClick={() => handleBook(event.id)}>
                {alreadyBooked ? 'You already booked' : isFull ? 'Event full' : 'Book this event'}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
