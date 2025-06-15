import type { Symptom, Specialization, Language, Doctor, Booking } from '@/types';
import { Stethoscope, Baby, HeartPulse, Lung, Bone, Brain, Users, Languages as LanguagesIcon } from 'lucide-react';

export const commonSymptoms: Symptom[] = [
  { id: 'fever', name: 'Fever' },
  { id: 'cough', name: 'Cough' },
  { id: 'headache', name: 'Headache' },
  { id: 'sore_throat', name: 'Sore Throat' },
  { id: 'stomach_pain', name: 'Stomach Pain' },
  { id: 'body_aches', name: 'Body Aches' },
  { id: 'skin_rash', name: 'Skin Rash' },
  { id: 'fatigue', name: 'Fatigue' },
  { id: 'dizziness', name: 'Dizziness' },
  { id: 'nausea', name: 'Nausea' },
  { id: 'shortness_of_breath', name: 'Shortness of Breath' },
  { id: 'chest_pain', name: 'Chest Pain' },
];

export const doctorSpecializations: Specialization[] = [
  { id: 'general_physician', name: 'General Physician', icon: Stethoscope },
  { id: 'pediatrician', name: 'Pediatrician', icon: Baby },
  { id: 'dermatologist', name: 'Dermatologist', icon: Users }, // Placeholder icon
  { id: 'cardiologist', name: 'Cardiologist', icon: HeartPulse },
  { id: 'pulmonologist', name: 'Pulmonologist', icon: Lung },
  { id: 'gastroenterologist', name: 'Gastroenterologist', icon: Users }, // Placeholder
  { id: 'neurologist', name: 'Neurologist', icon: Brain },
  { id: 'orthopedic_surgeon', name: 'Orthopedic Surgeon', icon: Bone },
];

export const supportedLanguages: Language[] = [
  { id: 'en', name: 'English', code: 'en' },
  { id: 'hi', name: 'Hindi', code: 'hi' },
  { id: 'bn', name: 'Bengali', code: 'bn' },
  { id: 'ta', name: 'Tamil', code: 'ta' },
  { id: 'te', name: 'Telugu', code: 'te' },
  { id: 'mr', name: 'Marathi', code: 'mr' },
  { id: 'gu', name: 'Gujarati', code: 'gu' },
  { id: 'kn', name: 'Kannada', code: 'kn' },
  { id: 'ml', name: 'Malayalam', code: 'ml' },
  { id: 'pa', name: 'Punjabi', code: 'pa' },
];

export const mockDoctors: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Priya Sharma',
    photoUrl: 'https://placehold.co/100x100.png',
    specialization: doctorSpecializations[0], // General Physician
    experience: 10,
    rating: 4.8,
    languages: [supportedLanguages[0], supportedLanguages[1]], // English, Hindi
    availability: { liveChat: true, videoCall: true, nextAvailableSlot: 'Today, 6 PM' },
    bio: 'Experienced General Physician with a focus on holistic patient care. Fluent in English and Hindi.',
  },
  {
    id: 'doc2',
    name: 'Dr. Rahul Verma',
    photoUrl: 'https://placehold.co/100x100.png',
    specialization: doctorSpecializations[3], // Cardiologist
    experience: 15,
    rating: 4.9,
    languages: [supportedLanguages[0], supportedLanguages[2]], // English, Bengali
    availability: { liveChat: false, videoCall: true, nextAvailableSlot: 'Tomorrow, 10 AM' },
    bio: 'Renowned Cardiologist specializing in preventative care and advanced cardiac treatments.',
  },
  {
    id: 'doc3',
    name: 'Dr. Anjali Desai',
    photoUrl: 'https://placehold.co/100x100.png',
    specialization: doctorSpecializations[1], // Pediatrician
    experience: 8,
    rating: 4.7,
    languages: [supportedLanguages[0], supportedLanguages[1], supportedLanguages[6]], // English, Hindi, Gujarati
    availability: { liveChat: true, videoCall: true, nextAvailableSlot: 'Today, 4 PM' },
    bio: 'Compassionate Pediatrician dedicated to child wellness and development.',
  },
  {
    id: 'doc4',
    name: 'Dr. Suresh Kumar',
    photoUrl: 'https://placehold.co/100x100.png',
    specialization: doctorSpecializations[2], // Dermatologist
    experience: 12,
    rating: 4.6,
    languages: [supportedLanguages[0], supportedLanguages[3]], // English, Tamil
    availability: { liveChat: true, videoCall: false, nextAvailableSlot: 'Next week' },
    bio: 'Expert Dermatologist with a passion for skin health and cosmetic dermatology.',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking1',
    doctorId: 'doc1',
    doctorName: 'Dr. Priya Sharma',
    patientId: 'user123',
    dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    type: 'video',
    status: 'confirmed',
    consultationId: 'consult1',
  },
  {
    id: 'booking2',
    doctorId: 'doc2',
    doctorName: 'Dr. Rahul Verma',
    patientId: 'user123',
    dateTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    type: 'video',
    status: 'completed',
  },
  {
    id: 'booking3',
    doctorId: 'doc3',
    doctorName: 'Dr. Anjali Desai',
    patientId: 'user123',
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // In 3 days
    type: 'chat',
    status: 'confirmed',
    consultationId: 'consult2',
  },
];
