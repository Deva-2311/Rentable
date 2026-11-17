'use client';

import React, { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AdminSidebar from './AdminSidebar';

export default function AdminHeader() {
  const [hasNewNotifications] = useState(true);
  const pathname = usePathname();

  // Generate breadcrumbs from pathname
  const paths = pathname.split('/').filter(Boolean);
  const breadcrumbItems = paths.map((path, index) => {
    const href = '/' + paths.slice(0, index + 1).join('/');
    return {
      label: path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, ' '),
      href: index === paths.length - 1 ? undefined : href,
    };
  });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center flex-1 space-x-4">
        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="md:hidden text-foreground hover:text-primary transition-colors">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-card border-r-border w-64">
            <AdminSidebar isMobile />
          </SheetContent>
        </Sheet>

        {/* Breadcrumbs */}
        <div className="hidden md:block">
          <Breadcrumbs items={breadcrumbItems} className="text-muted-foreground" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button 
          className="hidden md:flex items-center text-xs font-semibold text-muted-foreground bg-secondary border border-border px-3 py-1.5 rounded-sm hover:border-primary/30 transition-colors"
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(event);
          }}
        >
          <Search className="w-4 h-4 mr-2" />
          <span>Search... (Ctrl+K)</span>
        </button>

        <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {hasNewNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full border border-card"></span>
          )}
        </button>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm uppercase">
          A
        </div>
      </div>
    </header>
  );
}
