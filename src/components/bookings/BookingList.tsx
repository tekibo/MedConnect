
"use client";

import type { Booking } from '@/types';
import BookingItem from './BookingItem';
import { AlertCircle } from 'lucide-react';

type BookingListProps = {
  bookings: Booking[];
  title: string;
};

export default function BookingList({ bookings, title }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-10">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
        <p className="text-muted-foreground">No {title.toLowerCase()} bookings found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {bookings.map(booking => (
        <BookingItem key={booking.id} booking={booking} />
      ))}
    </div>
  );
}
