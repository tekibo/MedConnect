
"use client";
import VideoCallInterface from '@/components/consultation/VideoCallInterface';
import { useSearchParams, useParams } from 'next/navigation';
import { mockDoctors } from '@/lib/data'; // For fetching doctor name
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

// This page will represent an active consultation.
// The [id] would be the consultation ID.
export default function ConsultationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const consultationId = params.id as string;
  
  const [doctorName, setDoctorName] = useState('Doctor');
  const [patientName, setPatientName] = useState('Patient'); // In a real app, get from auth
  const [isLoading, setIsLoading] = useState(true);
  const [initialSymptoms, setInitialSymptoms] = useState<string | undefined>(undefined);


  useEffect(() => {
    // Simulate fetching consultation details
    const doctorId = searchParams.get('doctorId');
    const symptoms = searchParams.get('symptoms');
    if (symptoms) {
      setInitialSymptoms(symptoms.split(',').join(', '));
    }

    if (doctorId) {
      const doctor = mockDoctors.find(doc => doc.id === doctorId);
      if (doctor) {
        setDoctorName(doctor.name);
      }
    }
    // Simulate loading user data
    setPatientName("Ananya (You)"); // Placeholder
    
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-xl text-muted-foreground">Preparing your consultation...</p>
      </div>
    );
  }
  
  return (
    <VideoCallInterface 
      consultationId={consultationId} 
      doctorName={doctorName}
      patientName={patientName}
      initialSymptoms={initialSymptoms}
    />
  );
}
