'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Box, 
  CreditCard, 
  ShieldAlert, 
  BarChart, 
  Settings,
  MessageSquare
} from 'lucide-react';

const navItems = [
  { group: 'Overview', items: [
    { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  ]},
  { group: 'Marketplace', items: [
    { title: 'Products', href: '/admin/marketplace/products', icon: Box },
    { title: 'Categories', href: '/admin/marketplace/categories', icon: LayoutDashboard },
    { title: 'Bookings', href: '/admin/marketplace/bookings', icon: ShoppingCart }, // Will import in file
  ]},
  { group: 'People', items: [
    { title: 'Users & Owners', href: '/admin/people', icon: Users },
  ]},
  { group: 'Finance', items: [
    { title: 'Payments & Refunds', href: '/admin/finance', icon: CreditCard },
  ]},
  { group: 'Trust & Safety', items: [
    { title: 'Disputes & Reports', href: '/admin/trust', icon: ShieldAlert },
    { title: 'Reviews', href: '/admin/trust/reviews', icon: MessageSquare },
  ]},
  { group: 'Growth', items: [
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart },
  ]},
  { group: 'System', items: [
    { title: 'Settings', href: '/admin/settings', icon: Settings },
  ]},
];

// Re-import missing icon for simplicity
import { ShoppingCart } from 'lucide-react';

export default function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={isMobile ? "w-full bg-card border-r border-border h-full overflow-y-auto flex flex-col" : "w-64 bg-card border-r border-border h-screen sticky top-0 overflow-y-auto flex flex-col hidden md:flex"}>
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground tracking-widest uppercase">RENTABLE<span className="text-muted-foreground text-sm ml-2">ADMIN</span></h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 pb-8">
        {navItems.map((group, i) => (
          <div key={i}>
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, j) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
                return (
                  <Link 
                    key={j} 
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-sm transition-colors ${
                      isActive 
                        ? 'bg-secondary text-foreground' 
                        : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 mr-3 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
