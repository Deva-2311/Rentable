'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Search, 
  Package, 
  MapPin, 
  User, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Eye, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { useMyBookings, useUpdateBookingStatus } from '@/features/bookings/api/useBookings';
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from '@/lib/date-utils';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const TABS = [
  { key: 'ALL', label: 'All Orders' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'COMPLETED', label: 'Completed' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'REJECTED', label: 'Rejected' },
];

export default function BorrowerBookingsPage() {
  const { data: bookings = [], isLoading, isError, refetch } = useMyBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    try {
      await updateStatusMutation.mutateAsync({ id: bookingId, action: 'cancel' });
      toast.success('Booking cancelled successfully');
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  // Filter bookings
  const filteredBookings = bookings.filter((b: any) => {
    // Status filter
    if (activeTab !== 'ALL' && b.status !== activeTab) {
      return false;
    }

    // Search query filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const ref = (b.bookingId || b._id || '').toLowerCase();
      const product = (b.product?.name || '').toLowerCase();
      const owner = (b.owner?.fullName || '').toLowerCase();
      return ref.includes(q) || product.includes(q) || owner.includes(q);
    }

    return true;
  });

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-500/10 text-amber-700 border-amber-300';
      case 'CONFIRMED':
        return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'ACTIVE':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
      case 'COMPLETED':
        return 'bg-neutral-500/10 text-neutral-700 border-neutral-300';
      case 'CANCELLED':
      case 'REJECTED':
        return 'bg-red-500/10 text-red-700 border-red-300';
      default:
        return 'bg-secondary text-foreground border-border';
    }
  };

  const getPaymentBadgeStyle = (paymentStatus?: string) => {
    switch (paymentStatus) {
      case 'PAID':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-300';
      case 'FAILED':
        return 'bg-red-500/10 text-red-700 border-red-300';
      case 'REFUNDED':
        return 'bg-purple-500/10 text-purple-700 border-purple-300';
      default:
        return 'bg-amber-500/10 text-amber-700 border-amber-300';
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
            Borrower Portal
          </p>
          <h1 className="text-3xl md:text-4xl font-light font-heading text-foreground">
            My Booking Orders
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track equipment reservations, rental schedules, deposits, and payment statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/explore">
            <Button className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider h-10 px-5 rounded-lg hover:bg-primary/90">
              Browse Equipment
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order reference, product, or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Tab Counters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {TABS.map((tab) => {
            const count = tab.key === 'ALL' 
              ? bookings.length 
              : bookings.filter((b: any) => b.status === tab.key).length;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.key ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-2xl border border-border bg-card animate-pulse space-y-4">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="h-20 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
                <div className="h-20 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <div className="p-12 text-center rounded-2xl border border-red-200 bg-red-50/50 space-y-4">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
          <h3 className="text-lg font-medium text-red-900">Failed to load booking orders</h3>
          <p className="text-sm text-red-700 max-w-md mx-auto">
            We could not fetch your booking history from the server. Please check your connection and try again.
          </p>
          <Button onClick={() => refetch()} variant="outline" className="text-xs font-semibold">
            Retry Loading
          </Button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredBookings.length === 0 && (
        <div className="text-center py-20 px-4 rounded-2xl border border-border bg-card shadow-2xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No bookings found</h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {searchTerm || activeTab !== 'ALL'
              ? 'No booking orders match your search criteria or status filter.'
              : 'You have not made any rental bookings yet. Discover high-quality equipment available in your area.'}
          </p>
          <Link href="/explore">
            <Button className="mt-2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-lg h-10 px-6">
              Browse Equipment Catalog
            </Button>
          </Link>
        </div>
      )}

      {/* Booking Order List */}
      {!isLoading && !isError && filteredBookings.length > 0 && (
        <div className="space-y-5">
          {filteredBookings.map((b: any) => {
            const product = typeof b.product === 'object' ? b.product : null;
            const owner = typeof b.owner === 'object' ? b.owner : null;
            const duration = b.duration || calculateDurationDays(b.startDate, b.endDate);
            const bookingRef = b.bookingId || b._id;
            const isCancelling = cancellingId === b._id;

            return (
              <div 
                key={b._id} 
                className="border border-border rounded-2xl bg-card overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
              >
                {/* ── Order Top Bar: Reference, Date, Statuses ── */}
                <div className="bg-secondary/30 px-4 sm:px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Order Reference:
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {bookingRef}
                    </span>
                    <button
                      onClick={() => handleCopy(bookingRef, b._id)}
                      className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                      title="Copy Reference"
                    >
                      {copiedId === b._id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="hidden sm:inline text-muted-foreground">•</span>
                    <span className="text-muted-foreground block sm:inline">
                      Booked {formatDateDisplay(b.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPaymentBadgeStyle(b.paymentStatus)}`}>
                      {b.paymentStatus || 'PAYMENT PENDING'}
                    </span>
                    <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                </div>

                {/* ── Order Content Grid: 3 Distinct Sections ── */}
                <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Column 1: Product & Owner Info (5 cols) */}
                  <div className="lg:col-span-5 flex items-start gap-4">
                    <div className="w-18 h-18 rounded-xl bg-secondary shrink-0 relative overflow-hidden border border-border">
                      {product?.images?.[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={product.images[0]} 
                          alt={product.name || 'Product'} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Package className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">
                        Equipment
                      </p>
                      <h3 className="font-semibold text-foreground text-base line-clamp-1">
                        {product?.name || 'Rented Item'}
                      </h3>
                      {product?.location && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {product.location}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Owner: <span className="font-medium text-foreground">{owner?.fullName || 'Verified Partner'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Rental Period & Duration (4 cols) */}
                  <div className="lg:col-span-4 bg-secondary/30 p-3.5 rounded-xl border border-border/60 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" /> Rental Period
                      </span>
                      <span className="font-bold text-primary text-[11px] bg-primary/10 px-2 py-0.5 rounded-md">
                        {formatDurationDisplay(duration)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Pickup (Start)</span>
                        <span className="font-semibold text-foreground">{formatDateDisplay(b.startDate)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block">Return (End)</span>
                        <span className="font-semibold text-foreground">{formatDateDisplay(b.endDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Price Breakdown & Actions (3 cols) */}
                  <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-3 text-xs">
                    <div className="text-left lg:text-right w-full">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                        Final Amount
                      </span>
                      <div className="text-xl font-bold font-heading text-foreground">
                        {formatCurrency(b.totalAmount)}
                      </div>
                      <span className="text-[10px] text-muted-foreground block">
                        Subtotal {formatCurrency(b.rentalAmount)} + Deposit {formatCurrency(b.securityDeposit)}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 w-full lg:justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedBooking(b)}
                        className="text-xs font-semibold h-9 px-3 rounded-lg flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </Button>

                      {b.status === 'PENDING' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isCancelling}
                          onClick={() => handleCancelBooking(b._id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold h-9 px-3 rounded-lg"
                        >
                          {isCancelling ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      )}

                      {b.status === 'CONFIRMED' && b.paymentStatus !== 'PAID' && (
                        <Link href={`/checkout/${product?._id || b.product}?start=${b.startDate}&end=${b.endDate}`}>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider h-9 px-4 rounded-lg hover:bg-primary/90"
                          >
                            Pay Now
                          </Button>
                        </Link>
                      )}

                      {b.status === 'ACTIVE' && (
                        <Link href={`/borrower/rentals`}>
                          <Button
                            size="sm"
                            className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider h-9 px-3 rounded-lg hover:bg-primary/90 flex items-center gap-1"
                          >
                            Manage Rental <ArrowRight className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comprehensive Details Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        userRole="borrower"
        onActionSuccess={() => refetch()}
      />

    </div>
  );
}
