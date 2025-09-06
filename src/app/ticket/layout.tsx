'use client';

import { Suspense } from 'react';

export default function TicketLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div>Loading ticket...</div>}>
      {children}
    </Suspense>
  );
}
