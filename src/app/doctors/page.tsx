
"use client";

import { useState, useEffect, useMemo } from 'react';
import DoctorFilter from '@/components/doctors/DoctorFilter';
import DoctorMap from '@/components/doctors/DoctorMap'; // Changed from DoctorList
import { mockDoctors } from '@/lib/data'; 
import type { Doctor } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ALL_SPECIALIZATIONS_VALUE = "all";

export default function DoctorsPage() {
  const searchParams = useSearchParams();
  const initialSymptomsQuery = searchParams.get('symptoms');
  
  const [allDoctors] = useState<Doctor[]>(mockDoctors); 
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const initialSymptoms = useMemo(() => {
    return initialSymptomsQuery ? initialSymptomsQuery.split(',') : [];
  }, [initialSymptomsQuery]);

  const [currentFilters, setCurrentFilters] = useState<any>({ symptoms: initialSymptoms, specialization: '' });

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      let doctors = [...allDoctors];

      if (currentFilters.searchText) {
        doctors = doctors.filter(doc => 
          doc.name.toLowerCase().includes(currentFilters.searchText.toLowerCase())
        );
      }
      
      if (currentFilters.specialization && currentFilters.specialization !== ALL_SPECIALIZATIONS_VALUE && currentFilters.specialization !== '') {
        doctors = doctors.filter(doc => doc.specialization.id === currentFilters.specialization);
      }

      if (currentFilters.availability) {
        const { liveChat, videoCall, bookFuture } = currentFilters.availability;
        if (liveChat || videoCall || bookFuture) { 
          doctors = doctors.filter(doc => 
            (liveChat && doc.availability.liveChat) ||
            (videoCall && doc.availability.videoCall) ||
            (bookFuture && !!doc.availability.nextAvailableSlot) 
          );
        }
      }
      
      if (currentFilters.languages && currentFilters.languages.length > 0) {
        doctors = doctors.filter(doc => 
          currentFilters.languages.every((langId: string) => 
            doc.languages.some(docLang => docLang.id === langId)
          )
        );
      }
      
      setFilteredDoctors(doctors);
      setIsLoading(false);
    }, 500); 

    return () => clearTimeout(timeoutId);
  }, [allDoctors, currentFilters]);

  const handleFilterChange = (filters: any) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="container mx-auto py-8 md:py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Find Your Doctor</h1>
      
      {initialSymptoms.length > 0 && (
        <div className="mb-6 p-4 bg-primary/10 rounded-lg border border-primary/20">
          <p className="font-semibold text-primary">
            Searching for doctors based on symptoms: <span className="font-normal text-foreground">{initialSymptoms.join(', ')}</span>.
          </p>
          <p className="text-sm text-muted-foreground">Adjust filters or explore the map below.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-1/4 xl:w-1/5">
          <DoctorFilter onFilterChange={handleFilterChange} initialSymptoms={initialSymptoms} />
        </aside>
        <main className="lg:w-3/4 xl:w-4/5">
          {isLoading ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] bg-muted/30 rounded-lg">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg text-muted-foreground mt-4">Loading doctors map...</p>
            </div>
          ) : (
            <DoctorMap doctors={filteredDoctors} />
          )}
        </main>
      </div>
    </div>
  );
}
