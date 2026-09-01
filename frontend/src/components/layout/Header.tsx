"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Heart, LogOut, User as UserIcon, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  const onLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-6 py-6 transition-colors">
      <div className="flex w-full items-center justify-between font-bold text-[10px] uppercase tracking-widest text-foreground">
        <Link href="/" className="hover:text-red-500 transition-colors">
          Rentable
        </Link>
        
        <div className="hidden md:flex space-x-12 xl:space-x-24 absolute left-1/2 -translate-x-1/2">
          <Link href="/explore" className="hover:text-red-500 transition-colors">
            Explore
          </Link>
          <Link href="/categories" className="hover:text-red-500 transition-colors">
            Categories
          </Link>
          <Link href="/how-it-works" className="hover:text-red-500 transition-colors">
            How It Works
          </Link>
        </div>
          <nav className="flex items-center space-x-2">
            {isLoading ? (
              <div className="w-32 h-10 bg-secondary/20 rounded animate-pulse" />
            ) : user ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Wishlist">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Notifications">
                  <Bell className="h-4 w-4" />
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8 ml-2 cursor-pointer border border-primary/50 hover:border-primary transition-colors">
                      <AvatarImage src="" alt={user.fullName || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary">{(user.fullName || "U").charAt(0)}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.fullName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          <p className="text-xs font-bold text-primary mt-1 uppercase">
                            {user.role}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push(`/${user.role === 'borrower' ? 'borrower' : user.role === 'owner' ? 'owner' : 'admin'}/dashboard`)} className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/profile')} className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-red-500 focus:text-red-500">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-red-500 transition-colors">
                  Log In
                </Link>
              </>
            )}
          </nav>
      </div>
    </header>
  );
}
