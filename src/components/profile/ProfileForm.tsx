
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { supportedLanguages } from '@/lib/data';
import type { Language } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UserCog } from 'lucide-react';

type ProfileData = {
  fullName: string;
  email: string;
  phone: string;
  dob: string; // Date of Birth YYYY-MM-DD
  preferredLanguage: string; // language code
  medicalHistorySummary: string;
};

export default function ProfileForm() {
  const [profile, setProfile] = useState<ProfileData>({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    preferredLanguage: 'en',
    medicalHistorySummary: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching profile data
    setIsLoading(true);
    setTimeout(() => {
      setProfile({
        fullName: 'Ananya Sharma',
        email: 'ananya.sharma@example.com',
        phone: '+91 9876543210',
        dob: '1990-05-15',
        preferredLanguage: 'hi',
        medicalHistorySummary: 'Generally healthy. Allergic to penicillin. History of migraines.',
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleLanguageChange = (value: string) => {
    setProfile(prev => ({ ...prev, preferredLanguage: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    // Simulate saving profile data
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
      console.log("Profile saved:", profile);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="ml-3 text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
            <UserCog className="w-12 h-12 text-primary" />
        </div>
        <CardTitle className="text-3xl text-center">Your Profile</CardTitle>
        <CardDescription className="text-center">
          Manage your personal information and preferences.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" name="fullName" value={profile.fullName} onChange={handleChange} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address (cannot be changed)</Label>
              <Input id="email" name="email" type="email" value={profile.email} readOnly disabled className="bg-secondary/50" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" name="dob" type="date" value={profile.dob} onChange={handleChange} />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="preferredLanguage">Preferred Language for Communication</Label>
            <Select name="preferredLanguage" value={profile.preferredLanguage} onValueChange={handleLanguageChange}>
              <SelectTrigger id="preferredLanguage">
                <SelectValue placeholder="Select your preferred language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map((lang: Language) => (
                  <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="medicalHistorySummary">Medical History Summary</Label>
            <Textarea
              id="medicalHistorySummary"
              name="medicalHistorySummary"
              placeholder="Brief summary of important medical conditions, allergies, etc."
              value={profile.medicalHistorySummary}
              onChange={handleChange}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">This information will be shared with your doctor to provide better care.</p>
          </div>

          {/* Placeholder for Payment Methods */}
          <div className="pt-4">
            <h4 className="text-lg font-semibold mb-2">Payment Methods</h4>
            <p className="text-sm text-muted-foreground">Managing payment methods is not yet implemented.</p>
            <Button variant="outline" disabled className="mt-2">Add Payment Method</Button>
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving} className="w-full md:w-auto text-base py-2.5 px-6 shadow hover:shadow-md">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
