'use client';

import React from 'react';
import { BarChart, TrendingUp, Users, ShoppingBag, ArrowUpRight, Activity } from 'lucide-react';
import { useAdminStats } from '@/features/admin/api/useAdminDashboard';

export default function AdminAnalyticsPage() {
  const { data: stats, isLoading } = useAdminStats();

  const totalGMV = stats?.totalRevenue || 0;
  const platformRevenue = Math.round(totalGMV * 0.1); // 10% platform fee
  const totalUsers = stats?.totalUsers || 0;
  const totalBookings = stats?.totalBookings || 0;
  const activeRentals = stats?.activeRentals || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Marketplace Analytics</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time metrics derived from live MongoDB transactions and marketplace activity.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="border border-border bg-card rounded-xl p-6 relative overflow-hidden shadow-xs">
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Total Gross Merchandise (GMV)</div>
            <div className="text-3xl font-bold text-primary mb-1">
              {isLoading ? '...' : `₹${totalGMV.toLocaleString()}`}
            </div>
            <div className="flex items-center text-xs text-primary gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> From completed & confirmed bookings
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 relative overflow-hidden shadow-xs">
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Platform Fee Revenue (10%)</div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {isLoading ? '...' : `₹${platformRevenue.toLocaleString()}`}
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Activity className="w-3.5 h-3.5" /> Net platform commission
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 relative overflow-hidden shadow-xs">
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Total Marketplace Users</div>
            <div className="text-3xl font-bold text-foreground mb-1">
              {isLoading ? '...' : totalUsers}
            </div>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <Users className="w-3.5 h-3.5" /> Borrowers, owners & staff
            </div>
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 relative overflow-hidden shadow-xs">
          <div className="relative z-10">
            <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Active Rentals & Bookings</div>
            <div className="text-3xl font-bold text-primary mb-1">
              {isLoading ? '...' : `${activeRentals} / ${totalBookings}`}
            </div>
            <div className="flex items-center text-xs text-primary gap-1 font-medium">
              <ShoppingBag className="w-3.5 h-3.5" /> Active items in borrower custody
            </div>
          </div>
        </div>
      </div>

      {/* Real Breakdown Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border bg-card rounded-xl p-6 flex flex-col justify-between min-h-[300px] shadow-xs">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">Financial Flow Summary</h3>
            <p className="text-xs text-muted-foreground mb-6">Database aggregation of security deposits and rental transactions.</p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-secondary/40 p-4 rounded-lg border border-border">
              <div className="text-xs uppercase text-muted-foreground mb-1">Total Bookings</div>
              <div className="text-2xl font-bold text-foreground">{isLoading ? '...' : totalBookings}</div>
            </div>
            <div className="bg-secondary/40 p-4 rounded-lg border border-border">
              <div className="text-xs uppercase text-muted-foreground mb-1">Active Rentals</div>
              <div className="text-2xl font-bold text-primary">{isLoading ? '...' : activeRentals}</div>
            </div>
            <div className="bg-secondary/40 p-4 rounded-lg border border-border">
              <div className="text-xs uppercase text-muted-foreground mb-1">Pending Approval</div>
              <div className="text-2xl font-bold text-amber-700">{isLoading ? '...' : (stats?.pendingBookings || 0)}</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-6 border-t border-border pt-4">
            Aggregated in real-time via MongoDB pipeline across payments, rentals, and bookings collections.
          </div>
        </div>

        <div className="border border-border bg-card rounded-xl p-6 shadow-xs">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Inventory Metrics</h3>
          <div className="space-y-4">
            <div className="bg-secondary/40 p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Total Catalog Listings</div>
                <div className="text-lg font-bold text-foreground">{isLoading ? '...' : (stats?.totalProducts || 0)}</div>
              </div>
              <BarChart className="w-6 h-6 text-primary" />
            </div>
            <div className="bg-secondary/40 p-4 rounded-lg border border-border flex justify-between items-center">
              <div>
                <div className="text-xs uppercase text-muted-foreground">Registered Users</div>
                <div className="text-lg font-bold text-foreground">{isLoading ? '...' : totalUsers}</div>
              </div>
              <Users className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
