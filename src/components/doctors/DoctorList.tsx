
"use client";

import type { Doctor } from '@/types';
import DoctorCard from './DoctorCard';
import { AlertCircle } from 'lucide-react';

type DoctorListProps = {
  doctors: Doctor[];
};

export default function DoctorList({ doctors }: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground flex flex-col items-center">
        <AlertCircle className="w-16 h-16 mb-4 text-destructive" />
        <p className="text-xl font-semibold">No doctors found matching your criteria.</p>
        <p>Please try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
