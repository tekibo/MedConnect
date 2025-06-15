
"use client";

import { useState, useEffect, useMemo } from 'react';
import BookingList from '@/components/bookings/BookingList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockBookings } from '@/lib/data'; // Mock data
import type { Booking } from '@/types';
import { parseISO, isPast, isFuture } from 'date-fns';
import { Loader2 } from 'lucide-react';

export default function BookingsPage() {
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching bookings
    setIsLoading(true);
    setTimeout(() => {
      setAllBookings(mockBookings.sort((a, b) => parseISO(b.dateTime).getTime() - parseISO(a.dateTime).getTime()));
      setIsLoading(false);
    }, 500);
  }, []);

  const upcomingBookings = useMemo(() => {
    return allBookings.filter(b => isFuture(parseISO(b.dateTime)) && b.status === 'confirmed');
  }, [allBookings]);

  const pastBookings = useMemo(() => {
    return allBookings.filter(b => isPast(parseISO(b.dateTime)) || b.status === 'completed' || b.status === 'cancelled');
  }, [allBookings]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Your Appointments</h1>
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 md:mx-auto mb-8">
          <TabsTrigger value="upcoming" className="py-2.5 text-base">Upcoming</TabsTrigger>
          <TabsTrigger value="past" className="py-2.5 text-base">Past & Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <BookingList bookings={upcomingBookings} title="Upcoming Bookings" />
        </TabsContent>
        <TabsContent value="past">
          <BookingList bookings={pastBookings} title="Past & Cancelled Bookings" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
