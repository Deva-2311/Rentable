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
  Phone,
  Mail,
  RotateCcw,
  Sparkles,
  Inbox
} from 'lucide-react';
import { useOwnerBookings } from '@/features/owner/api/useOwner';
import { useUpdateBookingStatus } from '@/features/bookings/api/useBookings';
import { useActiveRentals, useRentalHistory, useCompleteRental } from '@/features/rentals/api/useRentals';
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from '@/lib/date-utils';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function OwnerBookingsPage() {
  const { data: bookings = [], isLoading: bookingsLoading, isError: bookingsError, refetch: refetchBookings } = useOwnerBookings();
  const { data: activeRentals = [], isLoading: activeLoading, refetch: refetchActive } = useActiveRentals();
  const { data: rentalHistory = [], isLoading: historyLoading, refetch: refetchHistory } = useRentalHistory();

  const updateBookingMutation = useUpdateBookingStatus();
  const completeRentalMutation = useCompleteRental();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'COMPLETED' | 'ALL'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [actionProcessingId, setActionProcessingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookingAction = async (bookingId: string, action: 'accept' | 'reject') => {
    setActionProcessingId(bookingId);
    try {
      await updateBookingMutation.mutateAsync({ id: bookingId, action });
      toast.success(`Booking ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      refetchBookings();
      refetchActive();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setActionProcessingId(null);
    }
  };

  const handleConfirmReturn = async (rentalId: string) => {
    setActionProcessingId(rentalId);
    try {
      await completeRentalMutation.mutateAsync(rentalId);
      toast.success('Return confirmed and rental completed!');
      refetchActive();
      refetchHistory();
      refetchBookings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to complete rental return');
    } finally {
      setActionProcessingId(null);
    }
  };

  const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING');

  // Filter bookings based on activeTab and searchTerm
  const filteredBookings = bookings.filter((b: any) => {
    if (activeTab === 'PENDING' && b.status !== 'PENDING') return false;
    if (activeTab === 'COMPLETED' && b.status !== 'COMPLETED') return false;
    if (activeTab === 'ACTIVE' && b.status !== 'ACTIVE') return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const ref = (b.bookingId || b._id || '').toLowerCase();
      const product = (b.product?.name || '').toLowerCase();
      const borrower = (b.borrower?.fullName || '').toLowerCase();
      return ref.includes(q) || product.includes(q) || borrower.includes(q);
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

  const isLoading = bookingsLoading || activeLoading || historyLoading;

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-6xl space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-2">
            Owner Management
          </p>
          <h1 className="text-3xl md:text-4xl font-light font-heading text-foreground">
            Rental Orders & Requests
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review incoming requests, manage active rentals, and track equipment returns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/owner/products">
            <Button variant="outline" className="text-xs font-bold uppercase tracking-wider h-10 px-4 rounded-lg">
              Manage Listings
            </Button>
          </Link>
        </div>
      </div>

      {/* Toolbar: Search & Tab Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-card p-4 rounded-xl border border-border shadow-2xs">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reference, product, or borrower..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
          />
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'PENDING'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Requests</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
              pendingBookings.length > 0 ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {pendingBookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ACTIVE'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Active Rentals</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary-foreground/20 text-primary-foreground">
              {activeRentals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLETED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'COMPLETED'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Completed</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
              {rentalHistory.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ALL'
                ? 'bg-primary text-primary-foreground shadow-2xs'
                : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>All Bookings</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-muted-foreground">
              {bookings.length}
            </span>
          </button>
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

      {/* ════════════════════════════════════════════════════════════════
          TAB: ACTIVE RENTALS
          ════════════════════════════════════════════════════════════════ */}
      {!isLoading && activeTab === 'ACTIVE' && (
        <div className="space-y-4">
          {activeRentals.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-foreground">No active rentals out</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                None of your items are currently with borrowers. New rentals will appear here once bookings are confirmed and paid.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeRentals.map((r: any) => {
                const product = typeof r.product === 'object' ? r.product : null;
                const borrower = typeof r.borrower === 'object' ? r.borrower : null;
                const booking = typeof r.booking === 'object' ? r.booking : null;
                const isProcessing = actionProcessingId === r._id;
                const startDate = r.startDate || booking?.startDate;
                const endDate = r.endDate || booking?.endDate;
                const duration = calculateDurationDays(startDate, endDate);

                return (
                  <div 
                    key={r._id} 
                    className="border border-border rounded-2xl bg-card overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                  >
                    {/* Top Bar */}
                    <div className="bg-secondary/30 px-4 sm:px-6 py-3 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                          Rental Document:
                        </span>
                        <span className="font-mono font-bold text-foreground">
                          {r._id}
                        </span>
                        {booking?.bookingId && (
                          <>
                            <span className="hidden sm:inline text-muted-foreground">•</span>
                            <span className="text-muted-foreground block sm:inline">Booking Ref: <span className="font-mono">{booking.bookingId}</span></span>
                          </>
                        )}
                      </div>

                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        r.status === 'RETURN_REQUESTED' ? 'bg-amber-500/10 text-amber-700 border-amber-300 animate-pulse' : 'bg-emerald-500/10 text-emerald-700 border-emerald-300'
                      }`}>
                        {r.status === 'RETURN_REQUESTED' ? 'RETURN REQUESTED BY BORROWER' : 'ACTIVE RENTAL'}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      {/* Product & Borrower (5 cols) */}
                      <div className="lg:col-span-5 flex items-start gap-4">
                        <div className="w-18 h-18 rounded-xl bg-secondary shrink-0 relative overflow-hidden border border-border">
                          {product?.images?.[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package className="w-7 h-7" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground text-base line-clamp-1">
                            {product?.name || 'Equipment'}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Rented by: <span className="font-medium text-foreground">{borrower?.fullName || 'Borrower'}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Contact: {borrower?.phone || borrower?.email || 'On file'}
                          </p>
                        </div>
                      </div>

                      {/* Rental Schedule (4 cols) */}
                      <div className="lg:col-span-4 bg-secondary/30 p-3.5 rounded-xl border border-border/60 space-y-1.5 text-xs">
                        <div className="flex justify-between items-center text-muted-foreground">
                          <span className="text-[10px] font-bold uppercase tracking-wider">Scheduled Rental</span>
                          <span className="font-bold text-primary">{formatDurationDisplay(duration)}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Commenced</span>
                            <span className="font-semibold text-foreground">{formatDateDisplay(startDate)}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-muted-foreground block">Return Due</span>
                            <span className="font-semibold text-primary">{formatDateDisplay(endDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action (3 cols) */}
                      <div className="lg:col-span-3 flex justify-start lg:justify-end">
                        {r.status === 'RETURN_REQUESTED' ? (
                          <Button
                            onClick={() => handleConfirmReturn(r._id)}
                            disabled={isProcessing}
                            className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider h-11 px-5 rounded-lg hover:bg-primary/90 shadow-sm"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1.5" />
                            {isProcessing ? 'Confirming...' : 'Confirm Return'}
                          </Button>
                        ) : (
                          <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-4 py-2 rounded-lg border border-border">
                            Item with borrower
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB: COMPLETED RENTALS HISTORY
          ════════════════════════════════════════════════════════════════ */}
      {!isLoading && activeTab === 'COMPLETED' && (
        <div className="space-y-4">
          {rentalHistory.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <RotateCcw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-foreground">No completed rentals yet</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Completed equipment returns will be archived here for your records.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {rentalHistory.map((r: any) => {
                const product = typeof r.product === 'object' ? r.product : null;
                const borrower = typeof r.borrower === 'object' ? r.borrower : null;
                const booking = typeof r.booking === 'object' ? r.booking : null;
                const startDate = r.startDate || booking?.startDate;
                const endDate = r.endDate || booking?.endDate;
                const duration = calculateDurationDays(startDate, endDate);

                return (
                  <div key={r._id} className="border border-border rounded-2xl bg-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xs">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-xl bg-secondary shrink-0 relative overflow-hidden border border-border">
                        {product?.images?.[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-base text-foreground">{product?.name || 'Equipment'}</h4>
                        <p className="text-xs text-muted-foreground">
                          Borrower: <span className="font-medium text-foreground">{borrower?.fullName || 'Borrower'}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Completed on: {formatDateDisplay(r.completedAt || r.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="text-left md:text-right text-xs space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">Rental Period</span>
                      <p className="font-medium text-foreground">
                        {formatDateDisplay(startDate)} – {formatDateDisplay(endDate)} ({formatDurationDisplay(duration)})
                      </p>
                      {booking?.rentalAmount && (
                        <p className="text-xs font-bold text-primary">
                          Earnings: {formatCurrency(booking.rentalAmount)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          TAB: REQUESTS & ALL BOOKINGS
          ════════════════════════════════════════════════════════════════ */}
      {!isLoading && (activeTab === 'PENDING' || activeTab === 'ALL') && (
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-20 px-4 rounded-2xl border border-border bg-card shadow-2xs space-y-3">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-medium text-foreground">
                {activeTab === 'PENDING' ? 'No pending rental requests' : 'No bookings found'}
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                {activeTab === 'PENDING' 
                  ? 'You are all caught up! When borrowers request your listings, they will appear here with accept and decline actions.' 
                  : 'No bookings match your current filter.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((b: any) => {
                const product = typeof b.product === 'object' ? b.product : null;
                const borrower = typeof b.borrower === 'object' ? b.borrower : null;
                const duration = b.duration || calculateDurationDays(b.startDate, b.endDate);
                const bookingRef = b.bookingId || b._id;
                const isProcessing = actionProcessingId === b._id;

                // Expected owner earnings is the base rental subtotal
                const expectedEarnings = b.rentalAmount || (product?.pricePerDay ? product.pricePerDay * duration : 0);

                return (
                  <div 
                    key={b._id} 
                    className="border border-border rounded-2xl bg-card overflow-hidden shadow-2xs hover:shadow-md transition-shadow"
                  >
                    {/* Top Bar: Reference, Date, Status */}
                    <div className="bg-secondary/30 px-4 sm:px-6 py-3.5 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          Request Reference:
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
                          Received {formatDateDisplay(b.createdAt)}
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

                    {/* Content Grid: 3 Distinct Sections */}
                    <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                      
                      {/* Section 1: Product & Borrower Information (5 cols) */}
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
                            Requested Listing
                          </p>
                          <h3 className="font-semibold text-foreground text-base line-clamp-1">
                            {product?.name || 'Equipment'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-medium text-foreground">
                              {borrower?.fullName || 'Borrower'}
                            </span>
                            <span className="text-[10px] bg-emerald-500/10 text-emerald-700 px-2 py-0.2 rounded-full font-bold">
                              Verified
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {borrower?.email || borrower?.phone || 'Contact verified'}
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Requested Rental Period (4 cols) */}
                      <div className="lg:col-span-4 bg-secondary/30 p-3.5 rounded-xl border border-border/60 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-primary" /> Requested Period
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

                      {/* Section 3: Earnings & Management Actions (3 cols) */}
                      <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-3 text-xs">
                        <div className="text-left lg:text-right w-full">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                            Your Rental Earnings
                          </span>
                          <div className="text-xl font-bold font-heading text-primary">
                            {formatCurrency(expectedEarnings)}
                          </div>
                          <span className="text-[10px] text-muted-foreground block">
                            Deposit: {formatCurrency(b.securityDeposit)} (Escrow)
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
                            <>
                              <Button
                                size="sm"
                                disabled={isProcessing}
                                onClick={() => handleBookingAction(b._id, 'accept')}
                                className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider h-9 px-4 rounded-lg hover:bg-primary/90"
                              >
                                {isProcessing ? 'Saving...' : 'Accept'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={isProcessing}
                                onClick={() => handleBookingAction(b._id, 'reject')}
                                className="border-red-300 text-red-600 hover:bg-red-50 text-xs font-semibold h-9 px-3 rounded-lg"
                              >
                                Decline
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Booking Details Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        userRole="owner"
        onActionSuccess={() => {
          refetchBookings();
          refetchActive();
        }}
      />

    </div>
  );
}
