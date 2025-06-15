
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import type { Doctor } from '@/types';
import { MapPin, UserCircle, Briefcase } from 'lucide-react'; // Added UserCircle for pins

type DoctorMapProps = {
  doctors: Doctor[];
};

// Define fixed dimensions for the map placeholder
const MAP_WIDTH = 800;
const MAP_HEIGHT = 500;
const PIN_SIZE = 32; // px, for button size
const EDGE_PADDING = 20; // px, padding from map edges for pins

export default function DoctorMap({ doctors }: DoctorMapProps) {
  const [doctorPositions, setDoctorPositions] = useState<Array<{ x: number; y: number }>>([]);

  useEffect(() => {
    // Generate positions only on the client-side to avoid hydration mismatches
    // and ensure positions are stable for the current set of doctors.
    setDoctorPositions(
      doctors.map((_, index) => {
        // Simple pseudo-random but deterministic placement within bounds for demo
        // Add a small offset based on index to reduce overlaps for few doctors
        const xOffset = (index * 30) % (MAP_WIDTH - 2 * EDGE_PADDING - PIN_SIZE); // Increased offset slightly for better spread
        const yOffset = (index * 45) % (MAP_HEIGHT - 2 * EDGE_PADDING - PIN_SIZE); // Increased offset slightly

        return {
          x: (Math.random() * 0.6 + 0.2) * (MAP_WIDTH - 2 * EDGE_PADDING - PIN_SIZE) + EDGE_PADDING + xOffset * 0.3, // Adjusted random range and offset impact
          y: (Math.random() * 0.6 + 0.2) * (MAP_HEIGHT - 2 * EDGE_PADDING - PIN_SIZE) + EDGE_PADDING + yOffset * 0.3, // Adjusted random range and offset impact
        };
      })
    );
  }, [doctors]); // Recalculate if doctors array changes

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] bg-muted/20 rounded-lg border border-dashed">
        <MapPin className="w-16 h-16 text-muted-foreground mb-4" />
        <p className="text-xl font-semibold text-muted-foreground">No doctors available</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full bg-secondary/20 rounded-lg shadow-lg overflow-hidden border" 
      style={{ width: `${MAP_WIDTH}px`, height: `${MAP_HEIGHT}px` }}
    >
      <Image
        src={`https://placehold.co/${MAP_WIDTH}x${MAP_HEIGHT}.png`}
        alt="Map of doctors in a city"
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        className="object-cover"
        data-ai-hint="city street map" // This hint guides image selection for a realistic map background
        priority
      />
      {doctors.map((doctor, index) => 
        doctorPositions[index] && (
        <Popover key={doctor.id}>
          <PopoverTrigger asChild>
            <button
              className="absolute flex items-center justify-center bg-primary text-primary-foreground rounded-full shadow-xl hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all"
              style={{
                top: `${Math.max(EDGE_PADDING, Math.min(doctorPositions[index].y, MAP_HEIGHT - PIN_SIZE - EDGE_PADDING))}px`, // Ensure pins don't go off edge
                left: `${Math.max(EDGE_PADDING, Math.min(doctorPositions[index].x, MAP_WIDTH - PIN_SIZE - EDGE_PADDING))}px`, // Ensure pins don't go off edge
                width: `${PIN_SIZE}px`,
                height: `${PIN_SIZE}px`,
              }}
              aria-label={`View details for ${doctor.name}`}
            >
              <UserCircle className="w-5 h-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <Image 
                src={doctor.photoUrl} 
                alt={doctor.name} 
                width={48} 
                height={48} 
                className="rounded-full border-2 border-primary object-cover"
                data-ai-hint="doctor portrait"
              />
              <div>
                <h4 className="font-semibold text-lg">{doctor.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center">
                  {doctor.specialization.icon ? <doctor.specialization.icon className="w-4 h-4 mr-1.5 text-primary" /> : <Briefcase className="w-4 h-4 mr-1.5 text-primary" />}
                  {doctor.specialization.name}
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">{doctor.experience} years experience</p>
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{doctor.bio}</p>
             <div className="mt-3 space-y-1">
                {doctor.availability.videoCall && <p className="text-xs text-green-600 font-medium">Video Call Available</p>}
                {doctor.availability.liveChat && <p className="text-xs text-blue-600 font-medium">Live Chat Available</p>}
            </div>
            <Button size="sm" className="mt-4 w-full" asChild>
              <Link href={`/consultation/request?doctorId=${doctor.id}`}>
                Consult Now
              </Link>
            </Button>
          </PopoverContent>
        </Popover>
      ))}
       <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Map data &copy; Placeholder Maps. Doctor locations are illustrative.
      </div>
    </div>
  );
}
