"use client";

export default function Footer() {
  // Hydration safety for date
  const getCurrentYear = () => new Date().getFullYear();
  const [year, setYear] = React.useState(getCurrentYear());

  React.useEffect(() => {
    setYear(getCurrentYear());
  }, []);


  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto max-w-screen-2xl text-center text-sm text-muted-foreground">
        <p>&copy; {year} SwasthyaSetu. All rights reserved.</p>
        <p className="mt-1">Bridging Health, Connecting Lives.</p>
      </div>
    </footer>
  );
}

import * as React from 'react';
