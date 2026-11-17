'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  Calendar, 
  Package, 
  User, 
  MapPin, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';
import { 
  formatDateDisplay, 
  formatDateTimeDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from '@/lib/date-utils';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api/client';

interface BookingDetailModalProps {
  booking: any | null;
  isOpen: boolean;
  onClose: () => void;
  userRole?: 'borrower' | 'owner' | 'admin';
  onActionSuccess?: () => void;
}

export function BookingDetailModal({
  booking,
  isOpen,
  onClose,
  userRole = 'borrower',
  onActionSuccess,
}: BookingDetailModalProps) {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminStatus, setAdminStatus] = useState('');
  const [adminReason, setAdminReason] = useState('');

  if (!isOpen || !booking) return null;

  const product = typeof booking.product === 'object' ? booking.product : null;
  const borrower = typeof booking.borrower === 'object' ? booking.borrower : null;
  const owner = typeof booking.owner === 'object' ? booking.owner : null;

  const duration = booking.duration || calculateDurationDays(booking.startDate, booking.endDate);
  const formattedStart = formatDateDisplay(booking.startDate);
  const formattedEnd = formatDateDisplay(booking.endDate);
  const formattedCreated = formatDateTimeDisplay(booking.createdAt);

  const bookingRef = booking.bookingId || booking._id;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef);
    setCopied(true);
    toast.success('Booking reference copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOwnerAction = async (action: 'accept' | 'reject') => {
    setIsSubmitting(true);
    try {
      await apiClient.patch(`/bookings/${booking._id}/${action}`);
      toast.success(`Booking ${action === 'accept' ? 'accepted' : 'rejected'} successfully`);
      onActionSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || `Failed to ${action} booking`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBorrowerCancel = async () => {
    if (!confirm('Are you sure you want to cancel this booking request?')) return;
    setIsSubmitting(true);
    try {
      await apiClient.patch(`/bookings/${booking._id}/cancel`);
      toast.success('Booking cancelled successfully');
      onActionSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminStatusChange = async () => {
    if (!adminStatus) {
      toast.error('Please select a target status');
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.patch(`/admin/bookings/${booking._id}/status`, {
        status: adminStatus,
        reason: adminReason || `Administrative transition to ${adminStatus}`,
      });
      toast.success(`Booking transitioned to ${adminStatus} successfully`);
      onActionSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update booking status');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-card border border-border rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border bg-secondary/30 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Order & Booking Overview
              </span>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">
                Placed on {formattedCreated}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground font-mono">
                {bookingRef}
              </h2>
              <button 
                onClick={handleCopyRef}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Copy Reference"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusBadgeStyle(booking.status)}`}>
              {booking.status}
            </span>
            <button 
              onClick={onClose}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 md:p-8 space-y-8 max-h-[75vh] overflow-y-auto">
          
          {/* ══════════════════════════════════════════════════════════════
              SECTION 1: ORDER INFORMATION
              ══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-primary" />
              1. Order Information
            </h3>

            {/* Product card */}
            <div className="p-4 rounded-xl border border-border bg-card flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4 shadow-2xs">
              <div className="w-20 h-20 rounded-lg bg-secondary shrink-0 relative overflow-hidden border border-border">
                {product?.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={product.images[0]} 
                    alt={product.name || 'Product'} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Package className="w-8 h-8" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base font-semibold text-foreground line-clamp-1">
                  {product?.name || 'Rented Equipment'}
                </h4>
                {product?.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {product.location}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
                  <span className="text-muted-foreground">
                    Daily Rate: <span className="font-semibold text-foreground">{formatCurrency(product?.pricePerDay || (booking.rentalAmount / (duration || 1)))}/day</span>
                  </span>
                  {product?.condition && (
                    <span className="text-muted-foreground">
                      Condition: <span className="font-semibold text-foreground">{product.condition}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Borrower & Owner Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Borrower Details */}
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                  Borrower Details
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {borrower?.fullName || 'Verified Borrower'}
                </p>
                <div className="space-y-1 text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{borrower?.email || 'Email on file'}</span>
                  </p>
                  {borrower?.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{borrower.phone}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Owner Details */}
              <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">
                  Equipment Owner
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {owner?.fullName || 'Equipment Partner'}
                </p>
                <div className="space-y-1 text-muted-foreground">
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{owner?.email || 'Email on file'}</span>
                  </p>
                  {owner?.phone && (
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{owner.phone}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 2: RENTAL PERIOD & TIMELINE
              ══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              2. Rental Period & Schedule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Start Date */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Start Date (Pickup)
                </span>
                <p className="text-base font-semibold text-foreground font-heading">
                  {formattedStart}
                </p>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Rental commences
                </span>
              </div>

              {/* End Date */}
              <div className="p-4 rounded-xl border border-border bg-card shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  End Date (Return)
                </span>
                <p className="text-base font-semibold text-foreground font-heading">
                  {formattedEnd}
                </p>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Scheduled return deadline
                </span>
              </div>

              {/* Total Duration */}
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 shadow-2xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-1">
                  Total Rental Duration
                </span>
                <p className="text-base font-bold text-primary font-heading">
                  {formatDurationDisplay(duration)}
                </p>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">
                  Billed calendar days
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 3: PRICE BREAKDOWN
              ══════════════════════════════════════════════════════════════ */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              3. Itemized Price Breakdown
            </h3>

            <div className="border border-border rounded-xl bg-card overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-3.5 text-muted-foreground">
                      Rental Subtotal ({formatDurationDisplay(duration)})
                    </td>
                    <td className="p-3.5 text-right font-medium text-foreground">
                      {formatCurrency(booking.rentalAmount)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-muted-foreground flex items-center gap-1.5">
                      Platform Escrow Fee (10%)
                    </td>
                    <td className="p-3.5 text-right font-medium text-foreground">
                      {formatCurrency(booking.platformFee)}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3.5 text-muted-foreground">
                      Refundable Security Deposit
                      <span className="block text-[10px] text-emerald-600">
                        Refunded after item return inspection
                      </span>
                    </td>
                    <td className="p-3.5 text-right font-medium text-foreground">
                      {formatCurrency(booking.securityDeposit)}
                    </td>
                  </tr>
                  <tr className="bg-secondary/40 font-bold">
                    <td className="p-4 text-sm text-foreground">
                      Final Payable Amount
                    </td>
                    <td className="p-4 text-right text-base text-primary">
                      {formatCurrency(booking.totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="p-3 bg-secondary/20 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Payment Status:</span>
                <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px] border ${getPaymentBadgeStyle(booking.paymentStatus)}`}>
                  {booking.paymentStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              SECTION 4: CONTEXTUAL ACTIONS
              ══════════════════════════════════════════════════════════════ */}
          {userRole === 'owner' && booking.status === 'PENDING' && (
            <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/50 space-y-3">
              <p className="text-xs font-semibold text-amber-900">
                Action Required: Pending Rental Request
              </p>
              <p className="text-xs text-amber-700">
                You can review this request and decide to accept or decline it.
              </p>
              <div className="flex gap-3 pt-1">
                <Button
                  onClick={() => handleOwnerAction('accept')}
                  disabled={isSubmitting}
                  className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-6 h-10 rounded-lg hover:bg-primary/90"
                >
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> Accept Request
                </Button>
                <Button
                  onClick={() => handleOwnerAction('reject')}
                  disabled={isSubmitting}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider px-6 h-10 rounded-lg"
                >
                  <XCircle className="w-4 h-4 mr-1.5" /> Decline
                </Button>
              </div>
            </div>
          )}

          {userRole === 'borrower' && booking.status === 'PENDING' && (
            <div className="p-4 rounded-xl border border-border bg-secondary/20 flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Changed your mind? You can cancel your pending request.
              </p>
              <Button
                onClick={handleBorrowerCancel}
                disabled={isSubmitting}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold uppercase tracking-wider h-9 rounded-lg"
              >
                Cancel Request
              </Button>
            </div>
          )}

          {userRole === 'admin' && (
            <div className="p-4 rounded-xl border border-border bg-secondary/30 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-foreground">
                Administrative State Transition
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Target Status
                  </label>
                  <select
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Target Status...</option>
                    {booking.status === 'PENDING' && (
                      <>
                        <option value="CONFIRMED">CONFIRMED (Approve)</option>
                        <option value="REJECTED">REJECTED (Decline)</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <>
                        <option value="ACTIVE">ACTIVE (Start Rental)</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </>
                    )}
                    {booking.status === 'ACTIVE' && (
                      <option value="COMPLETED">COMPLETED (Complete Rental)</option>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Transition Reason
                  </label>
                  <input
                    type="text"
                    placeholder="Audit reason (optional)"
                    value={adminReason}
                    onChange={(e) => setAdminReason(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-1">
                <Button
                  onClick={handleAdminStatusChange}
                  disabled={!adminStatus || isSubmitting}
                  className="bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-5 h-9 rounded-lg hover:bg-primary/90"
                >
                  Apply State Transition
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/20 flex justify-end">
          <Button
            onClick={onClose}
            variant="outline"
            className="text-xs font-semibold px-6 rounded-lg"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
