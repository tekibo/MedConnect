
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { doctorSpecializations, supportedLanguages } from '@/lib/data'; // Mock data
import type { Specialization, Language } from '@/types';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

type DoctorFilterProps = {
  onFilterChange: (filters: any) => void; // Replace 'any' with a proper filter type
  initialSymptoms?: string[];
};

type Filters = {
  specialization: string;
  availability: {
    liveChat: boolean;
    videoCall: boolean;
    bookFuture: boolean;
  };
  languages: string[];
  symptoms: string[];
  searchText: string;
};

const ALL_SPECIALIZATIONS_VALUE = "all";

export default function DoctorFilter({ onFilterChange, initialSymptoms = [] }: DoctorFilterProps) {
  const [filters, setFilters] = useState<Filters>({
    specialization: '', // Keep as '' to show placeholder initially
    availability: { liveChat: false, videoCall: false, bookFuture: false },
    languages: [],
    symptoms: initialSymptoms,
    searchText: '',
  });

  const handleSpecializationChange = (value: string) => {
    setFilters(prev => ({ ...prev, specialization: value }));
  };

  const handleAvailabilityChange = (type: keyof Filters['availability']) => {
    setFilters(prev => ({
      ...prev,
      availability: { ...prev.availability, [type]: !prev.availability[type] },
    }));
  };

  const handleLanguageChange = (langId: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(langId)
        ? prev.languages.filter(id => id !== langId)
        : [...prev.languages, langId],
    }));
  };
  
  const handleSearchTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchText: event.target.value }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    const newFilters = {
      specialization: '', // Reset to empty string to show placeholder
      availability: { liveChat: false, videoCall: false, bookFuture: false },
      languages: [],
      symptoms: initialSymptoms,
      searchText: '',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="p-6 bg-card rounded-xl shadow-lg space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <SlidersHorizontal className="w-5 h-5 mr-2 text-primary" />
          Filter Doctors
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-sm">
          <RotateCcw className="w-4 h-4 mr-1.5" /> Reset All
        </Button>
      </div>

      <Input 
        placeholder="Search by doctor name..."
        value={filters.searchText}
        onChange={handleSearchTextChange}
      />

      <Accordion type="multiple" defaultValue={['specialization', 'availability', 'languages']} className="w-full">
        <AccordionItem value="specialization">
          <AccordionTrigger className="text-base font-medium">Specialization</AccordionTrigger>
          <AccordionContent>
            <Select value={filters.specialization} onValueChange={handleSpecializationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Any Specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_SPECIALIZATIONS_VALUE}>Any Specialization</SelectItem>
                {doctorSpecializations.map((spec: Specialization) => (
                  <SelectItem key={spec.id} value={spec.id}>{spec.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="availability">
          <AccordionTrigger className="text-base font-medium">Availability</AccordionTrigger>
          <AccordionContent className="space-y-2.5">
            {([
              { id: 'liveChat', label: 'Live Chat Now' },
              { id: 'videoCall', label: 'Video Call Now' },
              { id: 'bookFuture', label: 'Book for Future' },
            ] as {id: keyof Filters['availability'], label: string}[]).map(avail => (
              <div key={avail.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`avail-${avail.id}`}
                  checked={filters.availability[avail.id]}
                  onCheckedChange={() => handleAvailabilityChange(avail.id)}
                />
                <Label htmlFor={`avail-${avail.id}`} className="font-normal cursor-pointer">{avail.label}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger className="text-base font-medium">Languages</AccordionTrigger>
          <AccordionContent className="space-y-2 max-h-48 overflow-y-auto">
            {supportedLanguages.map((lang: Language) => (
              <div key={lang.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`lang-${lang.id}`}
                  checked={filters.languages.includes(lang.id)}
                  onCheckedChange={() => handleLanguageChange(lang.id)}
                />
                <Label htmlFor={`lang-${lang.id}`} className="font-normal cursor-pointer">{lang.name}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button onClick={applyFilters} className="w-full text-base shadow hover:shadow-md transition-shadow">
        Apply Filters
      </Button>
    </div>
  );
}
