'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/user';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Lazy initializer — reads from localStorage only on first render (client-side)
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) return JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      document.cookie = 'accessToken=; path=/; max-age=0';
      document.cookie = 'userRole=; path=/; max-age=0';
    }
    setIsLoading(false);
  }, [user]);

  const login = (token: string, userData: User) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // Set cookies for middleware
    document.cookie = `accessToken=${token}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `userRole=${userData.role}; path=/; max-age=604800; SameSite=Lax`;
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    // Clear cookies
    document.cookie = 'accessToken=; path=/; max-age=0';
    document.cookie = 'userRole=; path=/; max-age=0';
    setUser(null);
    router.push('/login');
  };

  const updateUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
