
export type Symptom = {
  id: string;
  name: string;
};

export type Specialization = {
  id: string;
  name: string;
  icon?: React.ElementType;
};

export type Language = {
  id: string;
  name: string;
  code: string; // e.g., 'en', 'hi', 'bn'
};

export type Doctor = {
  id: string;
  name: string;
  photoUrl: string;
  specialization: Specialization;
  experience: number; // years
  rating: number; // 1-5
  languages: Language[];
  availability: {
    liveChat: boolean;
    videoCall: boolean;
    nextAvailableSlot?: string; // ISO date string or descriptive like "Today, 5 PM"
  };
  bio: string;
};

export type Booking = {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string; // Assume a patient ID
  dateTime: string; // ISO date string
  type: 'video' | 'chat' | 'clinic';
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  consultationId?: string; // Link to the consultation if applicable
};

export type Consultation = {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: string; // ISO
  endTime?: string; // ISO
  type: 'video' | 'chat';
  status: 'active' | 'ended' | 'scheduled';
  recordingUrl?: string;
  transcriptIds?: string[];
};

export type MedicalContext = {
  symptoms: Symptom[];
  history?: string;
};
