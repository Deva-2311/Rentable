"use client";

import React, { useEffect } from 'react';
import { Camera, CheckCircle, MapPin, Mail, Phone, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { BentoBlock } from '@/components/ui/bento-block';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-32 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/60 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/2" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        {/* Profile Header */}
        <div className="bg-card rounded-3xl border border-border p-8 md:p-12 mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left shadow-xs">
          
          <div className="relative group cursor-pointer shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-secondary border-2 border-border flex items-center justify-center overflow-hidden shadow-xs">
              <span className="text-4xl md:text-5xl text-primary font-bold">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full backdrop-blur-xs">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="flex-1 pt-2">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-semibold text-foreground">{user.fullName}</h1>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                user.role === 'admin' ? 'bg-purple-500/15 text-purple-800 border-purple-300' :
                user.role === 'owner' ? 'bg-secondary text-primary border-border' :
                'bg-primary/10 text-primary border-primary/20'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-muted-foreground text-sm flex items-center justify-center md:justify-start gap-2 mb-6 font-medium">
              <MapPin className="w-4 h-4 text-primary" /> Earth • Member since {new Date().getFullYear()}
            </p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-emerald-500/15 text-emerald-800 rounded-xl border border-emerald-500/30">
                <CheckCircle className="w-4 h-4" /> Identity Verified
              </span>
              <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold bg-secondary text-foreground rounded-xl border border-border">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> 5.0 Rating
              </span>
            </div>
          </div>
          
          <div className="w-full md:w-auto flex flex-col gap-3">
            <button className="w-full md:w-auto bg-primary text-primary-foreground rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-primary/90 transition-all shadow-xs">
              Edit Profile
            </button>
            <button className="w-full md:w-auto bg-secondary text-foreground border border-border rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-muted transition-all">
              Switch to {user.role === 'owner' ? 'Borrower' : 'Owner'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column - Verification & Contact */}
          <div className="space-y-8">
            <BentoBlock size="small" className="p-8 bg-card border-border shadow-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Verifications</h3>
              <div className="space-y-5 text-sm">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3 font-medium text-foreground">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    Email
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-3 font-medium text-foreground">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    Phone
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-medium text-foreground">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Shield className="w-4 h-4 text-primary" />
                    </div>
                    Govt ID
                  </div>
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
              </div>
            </BentoBlock>
            
            <BentoBlock size="small" className="p-8 bg-card border-border shadow-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-6">Security</h3>
              <div className="space-y-3">
                <button className="w-full text-left text-sm font-medium text-foreground bg-secondary/50 p-4 rounded-xl border border-border hover:bg-secondary transition-colors">
                  Change Password
                </button>
                <button className="w-full text-left text-sm font-medium text-foreground bg-secondary/50 p-4 rounded-xl border border-border hover:bg-secondary transition-colors flex justify-between items-center">
                  Two-Factor Auth <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground font-semibold">Off</span>
                </button>
                <button className="w-full text-left text-sm font-semibold text-red-700 bg-red-500/10 p-4 rounded-xl border border-red-200 hover:bg-red-500/20 transition-colors mt-6">
                  Delete Account
                </button>
              </div>
            </BentoBlock>
          </div>

          {/* Right Column - Stats & Reviews */}
          <div className="md:col-span-2 space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <BentoBlock size="small" className="p-8 text-center bg-primary/10 border-primary/20 shadow-xs">
                <div className="text-5xl font-bold text-primary mb-2">12</div>
                <div className="text-[10px] uppercase tracking-widest text-primary font-bold">Rentals Completed</div>
              </BentoBlock>
              <BentoBlock size="small" className="p-8 text-center bg-card border-border shadow-xs">
                <div className="text-5xl font-bold text-foreground mb-2">4</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Items Listed</div>
              </BentoBlock>
            </div>

            <BentoBlock size="large" className="p-8 bg-card border-border shadow-xs">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8">Recent Reviews</h3>
              <div className="space-y-8">
                <div className="pb-8 border-b border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold border border-border">
                        AS
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">Alice Smith</p>
                        <span className="text-xs text-muted-foreground">Oct 2024</span>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-secondary px-3 py-1.5 rounded-full border border-border">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 font-normal leading-relaxed">&quot;Great borrower, took perfect care of the camera. Returned on time with all accessories exactly as provided.&quot;</p>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-semibold border border-border">
                        TR
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">TechRentals</p>
                        <span className="text-xs text-muted-foreground">Sep 2024</span>
                      </div>
                    </div>
                    <div className="flex gap-1 bg-secondary px-3 py-1.5 rounded-full border border-border">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />)}
                    </div>
                  </div>
                  <p className="text-sm text-foreground/80 font-normal leading-relaxed">&quot;Smooth transaction. Highly recommended for future rentals.&quot;</p>
                </div>
              </div>
            </BentoBlock>
          </div>

        </div>
      </div>
    </div>
  );
}

// Temporary Star icon to avoid missing import
function Star({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
