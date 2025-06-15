
"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { mockDoctors } from '@/lib/data';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { Doctor } from '@/types';
import { Loader2, Video, MessageSquare, CalendarClock } from 'lucide-react';

export default function ConsultationRequestClientContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const doctorId = searchParams.get('doctorId');
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      const foundDoctor = mockDoctors.find(d => d.id === doctorId);
      setDoctor(foundDoctor || null);
    }
    setIsLoading(false);
  }, [doctorId]);

  const startConsultation = (type: 'video' | 'chat') => {
    // In a real app, create a consultation record in DB and get an ID
    const newConsultationId = `consult-${Date.now()}`;
    const symptoms = searchParams.get('symptoms');
    let url = `/consultation/${newConsultationId}?doctorId=${doctorId}&type=${type}`;
    if (symptoms) {
      url += `&symptoms=${symptoms}`;
    }
    router.push(url);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading doctor details...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Doctor Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The requested doctor could not be found. Please try again.</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push('/doctors')} className="w-full">
              Back to Doctors List
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <Image
            src={doctor.photoUrl}
            alt={`Photo of ${doctor.name}`}
            width={120}
            height={120}
            className="rounded-full border-4 border-primary object-cover mx-auto mb-4"
            data-ai-hint="doctor portrait"
          />
          <CardTitle className="text-3xl">Consult with {doctor.name}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">{doctor.specialization.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            You are about to start a consultation with {doctor.name}. Please choose your preferred method.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {doctor.availability.videoCall && (
              <Button 
                size="lg" 
                className="h-auto py-4 text-base flex-col gap-2 shadow hover:shadow-md"
                onClick={() => startConsultation('video')}
              >
                <Video className="w-8 h-8 mb-1" />
                Start Video Call
                <span className="text-xs font-normal opacity-80">(Immediate)</span>
              </Button>
            )}
            {doctor.availability.liveChat && (
              <Button 
                size="lg" 
                variant="outline"
                className="h-auto py-4 text-base flex-col gap-2 shadow hover:shadow-md"
                onClick={() => startConsultation('chat')}
              >
                <MessageSquare className="w-8 h-8 mb-1" />
                Start Live Chat
                <span className="text-xs font-normal opacity-80">(Immediate)</span>
              </Button>
            )}
          </div>
          {doctor.availability.nextAvailableSlot && (
             <Button 
                size="lg" 
                variant="secondary"
                className="w-full h-auto py-4 text-base flex-col gap-2 shadow hover:shadow-md"
                onClick={() => router.push(`/bookings/new?doctorId=${doctor.id}`)} // Navigate to a booking page
              >
                <CalendarClock className="w-8 h-8 mb-1" />
                Book Future Appointment
                <span className="text-xs font-normal opacity-80">(Next: {doctor.availability.nextAvailableSlot})</span>
              </Button>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.back()}>
            Choose a Different Doctor
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
