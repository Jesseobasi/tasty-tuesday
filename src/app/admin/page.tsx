'use client';

import { useState } from 'react';
import { AdminRoute } from '../../components/layout/AdminRoute';
import { useEvents } from '../../hooks/useEvents';
import { useAdminEvents } from '../../hooks/useAdminEvents';
import { useAdminBookings } from '../../hooks/useAdminBookings';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
type EventForm = {
  title: string;
  date: string;
  description: string;
  pricingTiers: { name: string; price: number }[];
  seatsTotal: number;
  isActive: boolean;
};

const emptyEvent: EventForm = {
  title: '',
  date: new Date().toISOString(),
  description: '',
  pricingTiers: [{ name: 'General', price: 45 }],
  seatsTotal: 12,
  isActive: true,
};

export default function AdminPage() {
  const { data: events, isLoading } = useEvents(true);
  const { createEvent, deleteEvent, updateEvent } = useAdminEvents();
  const { data: bookings, cancelBooking, isLoading: bookingsLoading } = useAdminBookings();
  const [form, setForm] = useState<EventForm>(emptyEvent);

  const handleCreate = () => {
    createEvent.mutate({ ...form, seatsAvailable: form.seatsTotal } as any);
  };

  return (
    <AdminRoute>
      <div className="container-responsive space-y-8 py-12">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted">Admin</p>
          <h1 className="text-3xl font-bold">Manage events</h1>
          <p className="text-sm text-neutral-600">Create, edit, delete events and control seats.</p>
        </div>

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold">Create event</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              label="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Date"
              type="datetime-local"
              value={form.date.slice(0, 16)}
              onChange={(e) => setForm({ ...form, date: new Date(e.target.value).toISOString() })}
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Input
              label="Total seats"
              type="number"
              value={form.seatsTotal}
              onChange={(e) => setForm({ ...form, seatsTotal: Number(e.target.value) })}
            />
            <Input
              label="Tier name"
              value={form.pricingTiers[0].name}
              onChange={(e) => setForm({ ...form, pricingTiers: [{ ...form.pricingTiers[0], name: e.target.value }] })}
            />
            <Input
              label="Tier price"
              type="number"
              value={form.pricingTiers[0].price}
              onChange={(e) => setForm({ ...form, pricingTiers: [{ ...form.pricingTiers[0], price: Number(e.target.value) }] })}
            />
          </div>
          <Button onClick={handleCreate} loading={createEvent.isPending}>
            Create
          </Button>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {isLoading && [1, 2].map((i) => <Card key={i} className="space-y-3"><Skeleton className="h-4 w-1/2" /></Card>)}
          {events?.map((event) => (
            <Card key={event.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <p className="text-sm text-neutral-600">Seats: {event.seatsAvailable}/{event.seatsTotal}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => updateEvent.mutate({ id: event.id, isActive: !event.isActive })}
                  >
                    {event.isActive ? 'Disable' : 'Activate'}
                  </Button>
                  <Button variant="ghost" onClick={() => deleteEvent.mutate(event.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Bookings</h3>
              <p className="text-sm text-neutral-600">Admin can cancel to free seats.</p>
            </div>
          </div>
          {bookingsLoading && <Skeleton className="h-4 w-1/3" />}
          {!bookingsLoading && bookings && bookings.length === 0 && (
            <p className="text-sm text-neutral-600">No bookings yet.</p>
          )}
          <div className="space-y-3">
            {bookings?.map((b) => {
              const event = events?.find((e) => e.id === b.eventId);
              return (
                <div key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div>
                    <p className="text-sm font-semibold">{event?.title ?? 'Event'}</p>
                    <p className="text-xs text-neutral-600">{b.userEmail ?? b.userId}</p>
                    <p className="text-xs text-neutral-500">Status: {b.status}</p>
                  </div>
                  {b.status !== 'cancelled' && (
                    <Button
                      variant="secondary"
                      loading={cancelBooking.isPending}
                      onClick={() => cancelBooking.mutate(b.id)}
                    >
                      Cancel booking
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </AdminRoute>
  );
}
