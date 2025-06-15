
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, AlertCircle } from 'lucide-react';
import type { Symptom } from '@/types';
import { commonSymptoms } from '@/lib/data'; // Mock data for now
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

export default function SymptomSelector() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const router = useRouter();

  const filteredSymptoms = useMemo(() => {
    if (!searchTerm) return commonSymptoms;
    return commonSymptoms.filter(symptom =>
      symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(symptomId)) {
        newSelected.delete(symptomId);
      } else {
        newSelected.add(symptomId);
      }
      return newSelected;
    });
  };

  const handleFindDoctors = () => {
    const symptomsQuery = Array.from(selectedSymptoms).join(',');
    router.push(`/doctors?symptoms=${symptomsQuery}`);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center">Tell Us How You're Feeling</CardTitle>
        <CardDescription className="text-center">
          Select your symptoms below. This will help us find the most suitable doctors for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for symptoms (e.g., fever, cough)"
            className="pl-10 text-base"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search symptoms"
          />
        </div>

        {filteredSymptoms.length > 0 ? (
          <ScrollArea className="h-72 rounded-md border p-4">
            <div className="space-y-3">
              {filteredSymptoms.map((symptom) => (
                <div key={symptom.id} className="flex items-center space-x-3 p-2 hover:bg-secondary/50 rounded-md transition-colors">
                  <Checkbox
                    id={`symptom-${symptom.id}`}
                    checked={selectedSymptoms.has(symptom.id)}
                    onCheckedChange={() => handleSymptomToggle(symptom.id)}
                    aria-labelledby={`label-symptom-${symptom.id}`}
                  />
                  <Label htmlFor={`symptom-${symptom.id}`} id={`label-symptom-${symptom.id}`} className="text-base cursor-pointer flex-grow">
                    {symptom.name}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-8 flex flex-col items-center">
            <AlertCircle className="w-12 h-12 mb-4 text-destructive" />
            <p className="font-semibold">No symptoms found matching "{searchTerm}".</p>
            <p>Try a different search term or check your spelling.</p>
          </div>
        )}

        {selectedSymptoms.size > 0 && (
          <div className="pt-4">
            <h4 className="font-semibold mb-2">Selected Symptoms:</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedSymptoms).map(symptomId => {
                const symptom = commonSymptoms.find(s => s.id === symptomId);
                return symptom ? (
                  <span key={symptom.id} className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm shadow">
                    {symptom.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          size="lg"
          className="w-full text-lg shadow-md hover:shadow-lg transition-shadow"
          onClick={handleFindDoctors}
          disabled={selectedSymptoms.size === 0}
        >
          Find Doctors for these symptoms ({selectedSymptoms.size})
        </Button>
      </CardFooter>
    </Card>
  );
}
