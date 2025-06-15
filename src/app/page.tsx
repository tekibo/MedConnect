
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, MessageSquareText, Users, Video, Languages, CalendarClock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: <Users className="h-10 w-10 text-primary mb-4" />,
    title: "Symptom Pre-selection",
    description: "Easily select your symptoms from a comprehensive list tailored for Indian common ailments before connecting with a doctor.",
  },
  {
    icon: <Video className="h-10 w-10 text-primary mb-4" />,
    title: "Video Consultations",
    description: "Secure and private video calls with qualified doctors from the comfort of your home.",
  },
  {
    icon: <Languages className="h-10 w-10 text-primary mb-4" />,
    title: "Live Translation",
    description: "Break language barriers with real-time translation between English and various Indian languages during your call.",
  },
  {
    icon: <MessageSquareText className="h-10 w-10 text-primary mb-4" />,
    title: "AI Transcription",
    description: "Record audio and get AI-powered transcriptions with medical nuance detection when paused.",
  },
  {
    icon: <CalendarClock className="h-10 w-10 text-primary mb-4" />,
    title: "Flexible Booking",
    description: "Choose immediate consultations via chat/video or schedule appointments for a future time that suits you.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary mb-4" />,
    title: "Secure & Private",
    description: "Your health information is kept confidential with our robust security measures.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to <span className="text-primary">SwasthyaSetu</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
            Your bridge to accessible healthcare. Connect with doctors, get live translations, and manage your health journey seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-shadow">
              <Link href="/symptoms">Check Symptoms & Find Doctors</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-lg hover:shadow-accent/30 transition-shadow">
              <Link href="/doctors">Browse Doctors</Link>
            </Button>
          </div>
          <div className="mt-16">
            <Image
              src="https://placehold.co/800x400.png"
              alt="Healthcare illustration"
              width={800}
              height={400}
              className="rounded-lg shadow-2xl mx-auto"
              data-ai-hint="healthcare technology"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose SwasthyaSetu?</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            We provide a comprehensive, AI-enhanced platform designed for your healthcare needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                <CardHeader className="items-center text-center">
                  {feature.icon}
                  <CardTitle className="text-2xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-16 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Simple Steps to Better Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">1</div>
              <h3 className="text-xl font-semibold mb-2">Select Symptoms</h3>
              <p className="text-muted-foreground">Describe how you're feeling or choose from our list.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">2</div>
              <h3 className="text-xl font-semibold mb-2">Find Your Doctor</h3>
              <p className="text-muted-foreground">Browse doctors by specialty, language, and availability.</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <div className="bg-primary text-primary-foreground rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold mb-4 shadow-md">3</div>
              <h3 className="text-xl font-semibold mb-2">Consult & Heal</h3>
              <p className="text-muted-foreground">Connect via video/chat, with live translation support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Join SwasthyaSetu today and experience a new era of healthcare.
          </p>
          <Button size="lg" asChild className="shadow-lg hover:shadow-primary/30 transition-shadow">
            <Link href="/auth/signup">Sign Up for Free</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
