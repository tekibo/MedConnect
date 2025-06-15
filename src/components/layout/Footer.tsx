
"use client";

import { useState, useEffect } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);


  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto max-w-screen-2xl text-center text-sm text-muted-foreground">
        <p>&copy; {year !== null ? year : ''} MedConnect. All rights reserved.</p>
        <p className="mt-1">Bridging Health, Connecting Lives.</p>
      </div>
    </footer>
  );
}
