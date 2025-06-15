
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Doctor } from '@/types';
import { Star, MessageSquare, Video, CalendarPlus, Languages as LanguagesIcon, Briefcase } from 'lucide-react';

type DoctorCardProps = {
  doctor: Doctor;
};

export default function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <CardHeader className="flex flex-row items-start gap-4 p-4 bg-secondary/30">
        <Image
          src={doctor.photoUrl}
          alt={`Photo of ${doctor.name}`}
          width={80}
          height={80}
          className="rounded-full border-2 border-primary object-cover"
          data-ai-hint="doctor portrait"
        />
        <div className="flex-grow">
          <CardTitle className="text-xl mb-1">{doctor.name}</CardTitle>
          <CardDescription className="flex items-center text-sm">
            {doctor.specialization.icon && <doctor.specialization.icon className="w-4 h-4 mr-1.5 text-primary" />}
            {doctor.specialization.name}
          </CardDescription>
          <div className="flex items-center mt-1 text-sm text-muted-foreground">
            <Briefcase className="w-4 h-4 mr-1.5 text-amber-500" />
            {doctor.experience} years experience
          </div>
        </div>
        <div className="flex items-center text-amber-500 font-semibold">
          <Star className="w-5 h-5 mr-1 fill-current" /> {doctor.rating.toFixed(1)}
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-3 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{doctor.bio}</p>
        
        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Languages</h4>
          <div className="flex flex-wrap gap-1.5">
            {doctor.languages.map(lang => (
              <Badge key={lang.id} variant="outline" className="text-xs">{lang.name}</Badge>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1">Availability</h4>
          <div className="flex flex-wrap gap-2 text-sm">
            {doctor.availability.liveChat && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                <MessageSquare className="w-3 h-3 mr-1" /> Live Chat
              </Badge>
            )}
            {doctor.availability.videoCall && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Video className="w-3 h-3 mr-1" /> Video Call
              </Badge>
            )}
            {doctor.availability.nextAvailableSlot && (
               <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                <CalendarPlus className="w-3 h-3 mr-1" /> {doctor.availability.nextAvailableSlot}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-secondary/30">
        <Button asChild className="w-full shadow hover:shadow-md transition-shadow">
          <Link href={`/consultation/request?doctorId=${doctor.id}`}>
            Consult Dr. {doctor.name.split(' ').slice(1).join(' ')}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
