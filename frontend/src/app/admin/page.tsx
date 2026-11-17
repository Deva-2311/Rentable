'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  Box, 
  ShoppingCart, 
  CreditCard, 
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { useAdminStats, useAdminAuditLogs } from '@/features/admin/api/useAdminDashboard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatCard = ({ title, value, change, icon: Icon, type = 'neutral', href }: any) => {
  const content = (
    <div className="bg-card border border-border p-5 rounded-lg flex flex-col shadow-sm hover:border-primary/40 transition-colors h-full">
      <div className="flex justify-between items-start mb-4">
        <div className="text-muted-foreground text-sm font-semibold">{title}</div>
        <div className={`p-2 rounded-sm ${type === 'danger' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-heading font-medium text-foreground mb-2">{value}</div>
      {change && (
        <div className="text-xs font-medium flex items-center text-primary">
          <ArrowUpRight className="w-3 h-3 mr-1" />
          {change}
        </div>
      )}
    </div>
  );

  if (href) {
    return <Link href={href} className="block">{content}</Link>;
  }
  return content;
};

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: auditLogs, isLoading: logsLoading } = useAdminAuditLogs();

  if (statsLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">Loading live database metrics...</p>
      </div>
    );
  }

  const totalUsers = stats?.totalUsers ?? 0;
  const totalProducts = stats?.totalProducts ?? 0;
  const totalBookings = stats?.totalBookings ?? 0;
  const activeRentals = stats?.activeRentals ?? 0;
  const pendingBookings = stats?.pendingBookings ?? 0;
  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalReviews = stats?.totalReviews ?? 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Needs Attention Queue */}
      <section>
        <h2 className="text-lg font-heading font-medium text-foreground mb-4 flex items-center">
          <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" /> Operational Attention Queue
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/marketplace/bookings" className="block">
            <div className={`bg-card border p-4 rounded-lg hover:bg-secondary/40 transition-colors shadow-sm ${pendingBookings > 0 ? 'border-amber-500/40 bg-amber-500/5' : 'border-border'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className={`text-3xl font-heading font-medium ${pendingBookings > 0 ? 'text-amber-500' : 'text-foreground'}`}>
                  {pendingBookings}
                </div>
                <ShoppingCart className="w-5 h-5 text-amber-500" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Bookings awaiting confirmation / action</div>
            </div>
          </Link>

          <Link href="/admin/marketplace/products" className="block">
            <div className="bg-card border border-border p-4 rounded-lg hover:bg-secondary/40 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="text-3xl font-heading font-medium text-primary">
                  {totalProducts}
                </div>
                <Box className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Catalog products managed</div>
            </div>
          </Link>

          <Link href="/admin/trust/reviews" className="block">
            <div className="bg-card border border-border p-4 rounded-lg hover:bg-secondary/40 transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="text-3xl font-heading font-medium text-purple-400">
                  {totalReviews}
                </div>
                <ShieldAlert className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-sm font-medium text-muted-foreground">Customer reviews in moderation pool</div>
            </div>
          </Link>
        </div>
      </section>

      {/* KPI Grid */}
      <section>
        <h2 className="text-lg font-heading font-medium text-foreground mb-4">Marketplace Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Active Rentals" value={activeRentals} change="Live in transit / handoff" icon={Activity} href="/admin/marketplace/bookings" />
          <StatCard title="Total Registered Users" value={totalUsers} change="Active accounts" icon={Users} href="/admin/people" />
          <StatCard title="Listed Products" value={totalProducts} change="In MongoDB catalog" icon={Box} href="/admin/marketplace/products" />
          <StatCard title="Total Bookings" value={totalBookings} change="Lifetime reservations" icon={ShoppingCart} href="/admin/marketplace/bookings" />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-heading font-medium text-foreground mb-4">Financial Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Gross Rental Revenue" value={`₹${totalRevenue.toLocaleString()}`} change="Aggregated from paid bookings" icon={TrendingUp} href="/admin/finance" />
          <StatCard title="Platform Revenue (10%)" value={`₹${Math.round(totalRevenue * 0.1).toLocaleString()}`} change="Platform commission" icon={CreditCard} href="/admin/finance" />
          <StatCard title="Total Transactions" value={stats?.totalPayments ?? 0} change="Verified payment records" icon={CreditCard} href="/admin/finance" />
          <StatCard title="Audit Log Entries" value={auditLogs?.length ?? 0} change="Administrative changes" icon={ShieldAlert} href="/admin/trust" />
        </div>
      </section>

      {/* Real-time Audit Activity Feed */}
      <section className="bg-card border border-border rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-heading font-medium text-foreground flex items-center gap-2">
            <span>Audit Trail & Activity</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </h2>
          <Link href="/admin/trust" className="text-xs font-semibold text-primary hover:underline">
            View All Audit Logs →
          </Link>
        </div>

        {logsLoading ? (
          <div className="py-6 text-center text-sm text-muted-foreground font-medium">Loading live logs...</div>
        ) : !auditLogs || auditLogs.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No admin audit actions recorded yet.
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.slice(0, 6).map((log: any) => (
              <div key={log._id} className="flex justify-between items-center py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded bg-secondary text-primary">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      <span className="font-semibold text-primary">{log.adminId?.fullName || log.adminRole || 'Admin'}</span>
                      {' '}&mdash; {log.action.replace(/_/g, ' ')}
                      {log.targetType && <span className="text-xs text-muted-foreground ml-1.5 font-mono">({log.targetType})</span>}
                    </div>
                    {log.reason && (
                      <div className="text-xs text-muted-foreground mt-0.5">{log.reason}</div>
                    )}
                  </div>
                </div>
                <div className="text-xs font-semibold text-muted-foreground whitespace-nowrap ml-4">
                  {new Date(log.createdAt).toLocaleDateString()} {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

