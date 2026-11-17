"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { Bell, Heart, LogOut, User as UserIcon, LayoutDashboard, Menu, X, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_LINKS = [
  { href: "/explore", label: "Explore" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile nav body scroll & route change closing
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileOpen]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "owner"
      ? "/owner/dashboard"
      : "/borrower/dashboard";

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur-md border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16 md:h-[72px]">

            {/* ── Wordmark ── */}
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-[0.2em] text-foreground hover:text-primary transition-colors duration-300"
            >
              Rentable
            </Link>

            {/* ── Center Nav (desktop) ── */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[10px] font-bold uppercase tracking-[0.25em] transition-colors duration-200 ${
                    pathname === link.href
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <span className="block h-px w-full bg-[#A9C5A0] mt-0.5 rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-2 md:gap-3">
              {!mounted || isLoading ? (
                <div className="w-20 h-7 bg-muted/20 animate-pulse rounded" />
              ) : user ? (
                <>
                  {/* Global Search */}
                  <button
                    aria-label="Search"
                    onClick={() => router.push("/explore")}
                    className="flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/30"
                  >
                    <Search className="h-4 w-4" />
                  </button>

                  {/* Wishlist */}
                  <button
                    aria-label="Wishlist"
                    onClick={() => router.push("/borrower/dashboard")}
                    className="hidden md:flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/30"
                  >
                    <Heart className="h-4 w-4" />
                  </button>

                  {/* Notifications */}
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label="Notifications"
                      className="relative hidden md:flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground transition-colors rounded-sm hover:bg-muted/30"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background"></span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80 border-border bg-card p-0">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                        <span className="text-xs font-bold uppercase tracking-widest">Notifications</span>
                        <button className="text-[10px] text-muted-foreground hover:text-foreground">Mark all read</button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        <div className="p-4 border-b border-border hover:bg-muted/10 transition-colors cursor-pointer">
                          <p className="text-xs font-medium mb-1">Your rental request was approved!</p>
                          <p className="text-[10px] text-muted-foreground">Sony A7IV Camera - 2 days ago</p>
                        </div>
                        <div className="p-4 border-b border-border hover:bg-muted/10 transition-colors cursor-pointer">
                          <p className="text-xs font-medium mb-1">New message from Owner</p>
                          <p className="text-[10px] text-muted-foreground">Regarding your upcoming trip - 3 days ago</p>
                        </div>
                      </div>
                      <div className="p-2 border-t border-border">
                        <button className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-[#A9C5A0] py-1.5 hover:bg-muted/10 rounded">
                          View All
                        </button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 group outline-none">
                      <Avatar className="h-7 w-7 border border-border group-hover:border-[#A9C5A0]/60 transition-colors">
                        <AvatarFallback className="bg-[#1F241F] text-[#A9C5A0] text-[10px] font-bold">
                          {(user.fullName || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden md:block text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors font-bold">
                        {user.fullName?.split(" ")[0]}
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 border-border bg-card">
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="pb-2">
                          <p className="text-xs font-medium">{user.fullName}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
                          <span className="inline-block text-[9px] font-bold uppercase tracking-widest text-[#A9C5A0] mt-1 border border-[#A9C5A0]/30 px-1.5 py-0.5">
                            {user.role}
                          </span>
                        </DropdownMenuLabel>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={() => router.push(dashboardPath)}
                        className="cursor-pointer text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground"
                      >
                        <LayoutDashboard className="mr-2 h-3.5 w-3.5" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push("/profile")}
                        className="cursor-pointer text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-foreground"
                      >
                        <UserIcon className="mr-2 h-3.5 w-3.5" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border" />
                      <DropdownMenuItem
                        onClick={() => { logout(); router.push("/"); }}
                        className="cursor-pointer text-xs uppercase tracking-widest font-bold text-red-500 hover:text-red-400"
                      >
                        <LogOut className="mr-2 h-3.5 w-3.5" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:block text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-[10px] font-bold uppercase tracking-[0.25em] bg-foreground text-background px-4 py-2 hover:bg-foreground/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Toggle menu"
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from going under the fixed header */}
      <div className="h-16 md:h-[72px] shrink-0" aria-hidden="true" />

      {/* ── Mobile Nav Overlay ── */}
      <div
        className={`fixed inset-0 z-40 bg-background flex flex-col justify-center px-8 transition-all duration-300 md:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-3xl font-light tracking-tight ${
                pathname === link.href ? "text-[#A9C5A0]" : "text-foreground/60 hover:text-foreground"
              } transition-colors`}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border my-4" />
          {!mounted || isLoading ? (
             <div className="w-full h-8 bg-muted/20 animate-pulse rounded" />
          ) : user ? (
            <>
              <Link href={dashboardPath} className="text-3xl font-light tracking-tight text-foreground/60 hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); router.push("/"); }}
                className="text-left text-3xl font-light tracking-tight text-red-500/70 hover:text-red-500 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-3xl font-light tracking-tight text-foreground/60 hover:text-foreground transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="text-3xl font-light tracking-tight text-[#A9C5A0]">
                Sign Up →
              </Link>
            </>
          )}
        </nav>
      </div>
    </>
  );
}
