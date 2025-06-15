
"use client";

import type { Booking } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Video, MessageSquare, UserCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO, isPast, isFuture } from 'date-fns';

type BookingItemProps = {
  booking: Booking;
};

export default function BookingItem({ booking }: BookingItemProps) {
  const bookingDate = parseISO(booking.dateTime);

  const getStatusBadgeVariant = (status: Booking['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'confirmed': return 'default'; // Primary color (blue)
      case 'completed': return 'secondary'; // Greenish or neutral success
      case 'cancelled': return 'destructive';
      case 'pending': return 'outline'; // Yellowish or neutral pending
      default: return 'outline';
    }
  };
  
  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />;
      default: return null;
    }
  };


  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">Consultation with {booking.doctorName}</CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
              {booking.type === 'video' ? <Video className="w-4 h-4 mr-1.5" /> : <MessageSquare className="w-4 h-4 mr-1.5" />}
              {booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Consultation
            </CardDescription>
          </div>
          <Badge variant={getStatusBadgeVariant(booking.status)} className="capitalize flex items-center gap-1">
            {getStatusIcon(booking.status)}
            {booking.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <CalendarDays className="w-4 h-4 mr-2 text-primary" />
          <span>{format(bookingDate, 'EEEE, MMMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2 text-primary" />
          <span>{format(bookingDate, 'hh:mm a')}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {booking.status === 'confirmed' && isFuture(bookingDate) && booking.consultationId && (
          <Button asChild>
            <Link href={`/consultation/${booking.consultationId}?doctorId=${booking.doctorId}`}>Join Call</Link>
          </Button>
        )}
        {booking.status === 'confirmed' && isFuture(bookingDate) && (
          <Button variant="outline">Reschedule</Button>
        )}
         {booking.status !== 'cancelled' && booking.status !== 'completed' && (
          <Button variant="ghost" className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90">Cancel</Button>
        )}
      </CardFooter>
    </Card>
  );
}
