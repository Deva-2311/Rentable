"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, History, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const BORROWER_LINKS = [
  { href: "/borrower/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/borrower/bookings", label: "My Bookings", icon: ShoppingBag },
  { href: "/borrower/rentals", label: "Rental History", icon: History },
  { href: "/borrower/wishlist", label: "Wishlist", icon: Heart },
];

export function BorrowerNav() {
  const pathname = usePathname();

  return (
    <div className="bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5">
          {BORROWER_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap",
                  isActive 
                    ? "bg-secondary text-primary border border-border shadow-xs" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-muted-foreground")} />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
