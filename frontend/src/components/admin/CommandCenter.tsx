'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Users,
  Box,
  ShieldAlert,
} from 'lucide-react';

export default function CommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-[10vh]">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="flex items-center px-4 py-3 border-b border-border bg-card">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            type="text" 
            placeholder="Search users, products, bookings... (Esc to close)"
            className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') setIsOpen(false);
            }}
          />
        </div>
        <div className="p-2 max-h-[60vh] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick Links</div>
          <button onClick={() => { router.push('/admin/people'); setIsOpen(false); }} className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors font-medium">
            <Users className="w-4 h-4 mr-3 text-primary" /> Manage Users
          </button>
          <button onClick={() => { router.push('/admin/marketplace/products'); setIsOpen(false); }} className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors font-medium">
            <Box className="w-4 h-4 mr-3 text-primary" /> Review Pending Products
          </button>
          <button onClick={() => { router.push('/admin/trust'); setIsOpen(false); }} className="w-full flex items-center px-3 py-2 text-sm text-foreground hover:bg-secondary rounded-md transition-colors font-medium">
            <ShieldAlert className="w-4 h-4 mr-3 text-destructive" /> View Audit Logs & Disputes
          </button>
        </div>
      </div>
    </div>
  );
}
