"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, MessageSquare, User } from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Explore", href: "/explore" },
    { icon: Calendar, label: "Bookings", href: "/borrower/dashboard" }, // Can adjust based on auth
    { icon: MessageSquare, label: "Messages", href: "/messages" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-border z-50 pb-safe">
      <nav className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "fill-primary/20" : ""}`} />
              <span className="text-[9px] uppercase tracking-widest font-bold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
