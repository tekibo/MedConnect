
import { Suspense } from 'react';
import DoctorsPageClientContent from '@/components/doctors/DoctorsPageClientContent';
import { Loader2 } from 'lucide-react';

function LoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)]">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 text-lg text-muted-foreground">Loading doctors...</p>
    </div>
  );
}

export default function DoctorsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DoctorsPageClientContent />
    </Suspense>
  );
}
