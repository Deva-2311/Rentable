import React from 'react';
import { BorrowerNav } from '@/components/layout/BorrowerNav';

export default function BorrowerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-16 md:pt-[72px]">
      <BorrowerNav />
      <div className="flex-1 w-full bg-background">
        {children}
      </div>
    </div>
  );
}
