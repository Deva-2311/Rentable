import React from 'react';
import { OwnerNav } from '@/components/layout/OwnerNav';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen pt-16 md:pt-[72px]">
      <OwnerNav />
      <div className="flex-1 w-full bg-background">
        {children}
      </div>
    </div>
  );
}
