'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  History, 
  Calendar, 
  Search, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  Package,
  User as UserIcon,
  Filter
} from 'lucide-react';
import { useAllRentals, useRequestReturn } from '@/features/rentals/api/useRentals';
import { useAuth } from '@/lib/auth/AuthContext';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';
import { Rental, RentalStatus } from '@/types/rental';
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from '@/lib/date-utils';

const FILTER_TABS = [
  { key: 'ALL', label: 'All Rentals' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'RETURN_REQUESTED', label: 'Return Pending' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'RETURNED', label: 'Returned' },
] as const;

export default function BorrowerRentalHistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: rentals = [], isLoading, refetch } = useAllRentals();
  const { mutateAsync: requestReturn, isPending: isRequestingReturn } = useRequestReturn();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [processingRentalId, setProcessingRentalId] = useState<string | null>(null);

  const handleReturnRequest = async (rentalId: string) => {
    setProcessingRentalId(rentalId);
    try {
      await requestReturn(rentalId);
      toast.success('Return request submitted to the owner');
      refetch();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to request return');
    } finally {
      setProcessingRentalId(null);
    }
  };

  // Metrics calculation
  const totalCount = rentals.length;
  const activeCount = rentals.filter((r) => r.status === 'ACTIVE').length;
  const returnRequestedCount = rentals.filter((r) => r.status === 'RETURN_REQUESTED').length;
  const completedCount = rentals.filter((r) => r.status === 'COMPLETED' || r.status === 'RETURNED').length;

  // Filter & Search logic
  const filteredRentals = rentals.filter((rental) => {
    // Tab filter
    if (activeTab === 'ACTIVE' && rental.status !== 'ACTIVE') return false;
    if (activeTab === 'RETURN_REQUESTED' && rental.status !== 'RETURN_REQUESTED') return false;
    if (activeTab === 'COMPLETED' && rental.status !== 'COMPLETED') return false;
    if (activeTab === 'RETURNED' && rental.status !== 'RETURNED') return false;

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const productName = rental.product?.name?.toLowerCase() || '';
      const ownerName = typeof rental.owner === 'object' ? rental.owner?.fullName?.toLowerCase() || '' : '';
      const rentalId = rental._id.toLowerCase();
      return productName.includes(query) || ownerName.includes(query) || rentalId.includes(query);
    }

    return true;
  });

  const getDaysCount = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-7xl animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary bg-primary/10 px-2.5 py-1 rounded">
              Borrower Portal
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Equipment Archive
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Rental History
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
            View, track, and manage all your active and past equipment rentals, return requests, and digital receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/explore">
            <Button className="rounded-xl h-11 px-5 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-xs">
              Browse More Gear
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Total Rentals</span>
            <History className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl md:text-3xl font-light text-foreground">{totalCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Lifetime bookings</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Currently Active</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl md:text-3xl font-light text-emerald-500">{activeCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">In your possession</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Return Pending</span>
            <RotateCcw className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl md:text-3xl font-light text-amber-500">{returnRequestedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Awaiting owner sign-off</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card">
          <div className="flex items-center justify-between text-muted-foreground mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-2xl md:text-3xl font-light text-foreground">{completedCount}</p>
          <p className="text-[11px] text-muted-foreground mt-1">Successfully returned</p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b md:border-b-0 border-border pb-2 md:pb-0">
          {FILTER_TABS.map((tab) => {
            const count = 
              tab.key === 'ALL' ? totalCount :
              tab.key === 'ACTIVE' ? activeCount :
              tab.key === 'RETURN_REQUESTED' ? returnRequestedCount :
              tab.key === 'COMPLETED' ? rentals.filter((r) => r.status === 'COMPLETED').length :
              rentals.filter((r) => r.status === 'RETURNED').length;

            const isSelected = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                  isSelected
                    ? 'bg-foreground text-background shadow-sm'
                    : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-background/20 text-background' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search equipment or owner..."
            className="pl-10 h-10 rounded-xl bg-card border-border text-xs"
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card animate-pulse flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-16 h-16 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-3 w-32 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-10 w-32 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : filteredRentals.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No rentals match your search' : 'No rentals found in this section'}
          description={
            searchQuery
              ? `No rental records matching "${searchQuery}". Try searching by another keyword.`
              : 'You do not have any rentals recorded under this category yet.'
          }
          icon={<Package className="h-12 w-12 text-muted-foreground/40" />}
          action={
            <Link href="/explore">
              <Button className="rounded-xl h-10 px-6 bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-xs">
                Explore Rentals
              </Button>
            </Link>
          }
        />
      ) : (
        /* Rental Cards / List */
        <div className="space-y-4">
          {filteredRentals.map((rental) => {
            const product = rental.product;
            const owner = typeof rental.owner === 'object' ? rental.owner : null;
            const booking = typeof rental.booking === 'object' ? rental.booking : null;
            const startDate = rental.startDate || booking?.startDate;
            const endDate = rental.endDate || booking?.endDate;
            const days = calculateDurationDays(startDate, endDate);
            const totalAmount = booking?.totalAmount || (product?.pricePerDay ? product.pricePerDay * days : 0);
            const isProcessing = processingRentalId === rental._id;

            return (
              <div
                key={rental._id}
                className="group p-6 rounded-2xl border border-border bg-card hover:border-forest-primary/40 hover:shadow-lg hover:shadow-black/5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Left: Product Info & Image */}
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="w-20 h-20 rounded-2xl bg-muted border border-border/80 overflow-hidden shrink-0 flex items-center justify-center relative">
                    {product?.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name || 'Equipment'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <Package className="w-8 h-8 text-muted-foreground/50" />
                    )}
                  </div>

                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge status={rental.status} />
                      <span className="text-[11px] font-mono text-muted-foreground">
                        ID: {rental._id.slice(-6).toUpperCase()}
                      </span>
                    </div>

                    <h3 className="font-medium text-lg text-foreground truncate max-w-md">
                      {product?.name || 'Equipment Rental'}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {owner?.fullName && (
                        <span className="flex items-center gap-1.5">
                          <UserIcon className="w-3.5 h-3.5 text-forest-primary" />
                          Owner: <strong className="font-medium text-foreground">{owner.fullName}</strong>
                        </span>
                      )}
                      {product?.location && (
                        <span>• {product.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Center: Rental Dates & Duration */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:px-6 lg:border-x lg:border-border/60">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Rental Window ({formatDurationDisplay(days)})
                    </p>
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Calendar className="w-4 h-4 text-forest-primary shrink-0" />
                      <span>
                        {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)}
                      </span>
                    </div>
                    {rental.returnRequestedAt && rental.status === 'RETURN_REQUESTED' && (
                      <p className="text-[11px] text-amber-500 font-medium">
                        Return requested on {formatDateDisplay(rental.returnRequestedAt)}
                      </p>
                    )}
                    {rental.completedAt && rental.status === 'COMPLETED' && (
                      <p className="text-[11px] text-emerald-500 font-medium">
                        Returned & closed on {formatDateDisplay(rental.completedAt)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Total Rental
                    </p>
                    <p className="text-xl font-medium text-foreground">
                      {totalAmount > 0 ? formatCurrency(totalAmount) : '—'}
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full lg:w-auto justify-end">
                  {rental.status === 'ACTIVE' && (
                    <Button
                      onClick={() => handleReturnRequest(rental._id)}
                      disabled={isProcessing}
                      variant="outline"
                      className="rounded-xl h-11 px-4 text-xs font-bold uppercase tracking-wider border-amber-500/40 text-amber-500 hover:bg-amber-500/10 hover:text-amber-600 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      {isProcessing ? 'Requesting...' : 'Request Return'}
                    </Button>
                  )}

                  {rental.status === 'RETURN_REQUESTED' && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 bg-amber-500/10 px-3 py-2 rounded-xl border border-amber-500/20 text-center">
                      Owner Confirmation Pending
                    </span>
                  )}

                  {rental.status === 'COMPLETED' && product?._id && (
                    <Link href={`/products/${product._id}`}>
                      <Button
                        variant="outline"
                        className="rounded-xl h-11 px-4 text-xs font-bold uppercase tracking-wider border-border hover:bg-muted"
                      >
                        Rent Again
                      </Button>
                    </Link>
                  )}

                  {/* Manage / Details Button */}
                  <Link href={`/borrower/rentals/${rental._id}`}>
                    <Button className="rounded-xl h-11 px-5 bg-foreground text-background hover:bg-foreground/90 text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      <span>Manage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>

                  {/* Confirmation / Receipt link */}
                  {(rental.booking?._id || typeof rental.booking === 'string') && (
                    <Link 
                      href={`/booking/${rental.booking?._id || rental.booking}/confirmation`}
                      title="View Order Receipt"
                      className="p-3 rounded-xl border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
