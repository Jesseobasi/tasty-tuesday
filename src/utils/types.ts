export type PricingTier = {
  name: string;
  price: number;
  description?: string;
};

export type Event = {
  id: string;
  title: string;
  date: string | Date | { toDate: () => Date }; // Firestore Timestamp or ISO
  description: string;
  pricingTiers: PricingTier[];
  seatsTotal: number;
  seatsAvailable: number;
  isActive: boolean;
};

export type Booking = {
  id: string;
  userId: string;
  eventId: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  userEmail?: string;
  cancelledAt?: string;
};
