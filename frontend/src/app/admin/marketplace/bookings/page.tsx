'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ShieldCheck, 
  X, 
  Package, 
  RotateCcw,
  Copy,
  Check,
  CreditCard
} from 'lucide-react';
import { useAdminBookings, useAdminUpdateBookingStatus } from '@/features/admin/api/useAdminDashboard';
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency, 
  parseDateSafe 
} from '@/lib/date-utils';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

const STATUS_FILTERS = ['ALL', 'PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'REJECTED'];
const PAYMENT_FILTERS = ['ALL', 'PAID', 'PENDING', 'FAILED', 'REFUNDED'];

export default function BookingsManagementPage() {
  const { data: bookings = [], isLoading, refetch } = useAdminBookings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('ALL');
  const [startDateFrom, setStartDateFrom] = useState('');
  const [startDateTo, setStartDateTo] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Reference copied');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedStatus('ALL');
    setSelectedPaymentStatus('ALL');
    setStartDateFrom('');
    setStartDateTo('');
  };

  const hasActiveFilters = 
    searchTerm !== '' || 
    selectedStatus !== 'ALL' || 
    selectedPaymentStatus !== 'ALL' || 
    startDateFrom !== '' || 
    startDateTo !== '';

  const filteredBookings = bookings.filter((b: any) => {
    // 1. Search filter: by reference, MongoDB ID, product name, borrower name/email, owner name/email
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const bookingRef = (b.bookingId || '').toLowerCase();
      const mongoId = (b._id || '').toLowerCase();
      const productName = (b.product?.name || '').toLowerCase();
      const borrowerName = (b.borrower?.fullName || '').toLowerCase();
      const borrowerEmail = (b.borrower?.email || '').toLowerCase();
      const ownerName = (b.owner?.fullName || '').toLowerCase();
      const ownerEmail = (b.owner?.email || '').toLowerCase();

      const matchesSearch = 
        bookingRef.includes(q) ||
        mongoId.includes(q) ||
        productName.includes(q) ||
        borrowerName.includes(q) ||
        borrowerEmail.includes(q) ||
        ownerName.includes(q) ||
        ownerEmail.includes(q);

      if (!matchesSearch) return false;
    }

    // 2. Booking status filter
    if (selectedStatus !== 'ALL' && b.status !== selectedStatus) {
      return false;
    }

    // 3. Payment status filter
    if (selectedPaymentStatus !== 'ALL' && b.paymentStatus !== selectedPaymentStatus) {
      return false;
    }

    // 4. Date Range filter (Start Date boundary)
    if (startDateFrom) {
      const fromDate = parseDateSafe(startDateFrom);
      const bStartDate = parseDateSafe(b.startDate);
      if (fromDate && bStartDate && bStartDate < fromDate) {
        return false;
      }
    }

    if (startDateTo) {
      const toDate = parseDateSafe(startDateTo);
      const bStartDate = parseDateSafe(b.startDate);
      if (toDate && bStartDate && bStartDate > toDate) {
        return false;
      }
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
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">
            Bookings & Orders Management
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Audit canonical booking orders, inspect rental period schedules, and manage administrative transitions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-secondary px-3.5 py-1.5 rounded-full border border-border text-foreground font-mono font-medium">
            Total: {bookings.length} Records
          </span>
          <span className="text-xs bg-primary/10 text-primary px-3.5 py-1.5 rounded-full border border-primary/20 font-mono font-medium">
            Filtered: {filteredBookings.length}
          </span>
        </div>
      </div>

      {/* Toolbar & Multi-criteria Filters */}
      <div className="bg-card p-5 rounded-2xl border border-border shadow-2xs space-y-4">
        
        {/* Row 1: Search & Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Functional Search (Reference, ID, Names) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reference (BKG-...), MongoDB ID, product, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {/* Date Range: From Date */}
          <div className="md:col-span-3 flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              From:
            </label>
            <input
              type="date"
              value={startDateFrom}
              onChange={(e) => setStartDateFrom(e.target.value)}
              className="bg-transparent border-none text-xs text-foreground w-full outline-none cursor-pointer"
            />
          </div>

          {/* Date Range: To Date */}
          <div className="md:col-span-3 flex items-center gap-2 bg-secondary/30 px-3 py-1.5 rounded-lg border border-border">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground shrink-0">
              To:
            </label>
            <input
              type="date"
              value={startDateTo}
              onChange={(e) => setStartDateTo(e.target.value)}
              className="bg-transparent border-none text-xs text-foreground w-full outline-none cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <div className="md:col-span-1 flex justify-end">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 p-2 hover:bg-secondary rounded-lg transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status Badges and Payment Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
          
          {/* Status Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
              Status:
            </span>
            {STATUS_FILTERS.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-colors ${
                  selectedStatus === st
                    ? 'bg-primary text-primary-foreground shadow-2xs'
                    : 'bg-secondary/40 text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Payment Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Payment:
            </span>
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="bg-secondary/50 border border-border rounded-md px-2.5 py-1 text-xs text-foreground focus:outline-none focus:border-primary font-medium"
            >
              {PAYMENT_FILTERS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Identifiable Booking Order Table */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-secondary/50 border-b border-border text-[10px] uppercase text-muted-foreground tracking-wider font-bold">
                <th className="p-4">Order Reference & Product</th>
                <th className="p-4">Borrower</th>
                <th className="p-4">Owner</th>
                <th className="p-4">Rental Period</th>
                <th className="p-4">Price Breakdown</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading booking orders from MongoDB...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-muted-foreground space-y-2">
                    <p className="text-sm font-medium text-foreground">No bookings found</p>
                    <p className="text-xs">No records matched the selected filters. Try broadening your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => {
                  const product = typeof b.product === 'object' ? b.product : null;
                  const borrower = typeof b.borrower === 'object' ? b.borrower : null;
                  const owner = typeof b.owner === 'object' ? b.owner : null;
                  const duration = b.duration || calculateDurationDays(b.startDate, b.endDate);
                  const bookingRef = b.bookingId || b._id;

                  return (
                    <tr key={b._id} className="hover:bg-secondary/20 transition-colors">
                      
                      {/* Column 1: Order Reference & Product */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-secondary shrink-0 relative overflow-hidden border border-border mt-0.5">
                            {product?.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                <Package className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 font-mono font-bold text-primary">
                              <span>{bookingRef}</span>
                              <button
                                onClick={() => handleCopy(bookingRef, b._id)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                                title="Copy ID"
                              >
                                {copiedId === b._id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              </button>
                            </div>
                            <div className="text-sm font-semibold text-foreground line-clamp-1 mt-0.5">
                              {product?.name || 'Rented Item'}
                            </div>
                            <span className="text-[10px] text-muted-foreground block">
                              Booked: {formatDateDisplay(b.createdAt)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Column 2: Borrower */}
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-foreground">
                          {borrower?.fullName || 'Borrower'}
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          {borrower?.email || 'N/A'}
                        </div>
                        {borrower?.phone && (
                          <div className="text-[10px] text-muted-foreground">
                            {borrower.phone}
                          </div>
                        )}
                      </td>

                      {/* Column 3: Owner */}
                      <td className="p-4 text-xs">
                        <div className="font-semibold text-foreground">
                          {owner?.fullName || 'Equipment Partner'}
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          {owner?.email || 'N/A'}
                        </div>
                      </td>

                      {/* Column 4: Rental Period (Separate Fields) */}
                      <td className="p-4 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground w-10">Start:</span>
                            <span>{formatDateDisplay(b.startDate)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-foreground font-medium">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground w-10">End:</span>
                            <span>{formatDateDisplay(b.endDate)}</span>
                          </div>
                          <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-sm inline-block">
                            {formatDurationDisplay(duration)}
                          </div>
                        </div>
                      </td>

                      {/* Column 5: Price Breakdown */}
                      <td className="p-4 text-xs">
                        <div className="space-y-0.5">
                          <div className="text-sm font-bold text-foreground">
                            {formatCurrency(b.totalAmount)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Subtotal: {formatCurrency(b.rentalAmount)}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            Deposit: {formatCurrency(b.securityDeposit)}
                          </div>
                        </div>
                      </td>

                      {/* Column 6: Payment Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPaymentBadgeStyle(b.paymentStatus)}`}>
                          {b.paymentStatus || 'PENDING'}
                        </span>
                      </td>

                      {/* Column 7: Booking Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </td>

                      {/* Column 8: Actions */}
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedBooking(b)}
                          className="text-xs font-semibold h-8 px-3 rounded-lg flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> Inspect
                        </Button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Review & Transition Modal */}
      <BookingDetailModal
        booking={selectedBooking}
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        userRole="admin"
        onActionSuccess={() => refetch()}
      />

    </div>
  );
}
