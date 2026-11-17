'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Clock, 
  MessageSquare, 
  AlertTriangle, 
  ArrowRightCircle, 
  Calendar, 
  MapPin, 
  Package, 
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import Link from 'next/link';
import { useRental, useRequestReturn } from '@/features/rentals/api/useRentals';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { formatDateDisplay, calculateDurationDays, formatDurationDisplay } from '@/lib/date-utils';

export default function ActiveRentalPage() {
  const params = useParams();
  const router = useRouter();
  const rentalId = params.id as string;

  const { data: rental, isLoading, refetch } = useRental(rentalId);
  const { mutateAsync: requestReturn, isPending: isRequestingReturn } = useRequestReturn();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReturn = async () => {
    if (!rental?._id) return;
    setIsSubmitting(true);
    try {
      await requestReturn(rental._id);
      toast.success('Return requested successfully! The owner will verify the return.');
      refetch();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to request return');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-12 max-w-5xl space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded" />
        <div className="h-10 w-72 bg-muted rounded" />
        <div className="h-40 w-full bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 h-64 bg-muted rounded-2xl" />
          <div className="h-64 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!rental) {
    return (
      <div className="container mx-auto px-4 md:px-8 py-20 max-w-2xl text-center space-y-4">
        <h2 className="text-2xl font-light">Rental Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested rental record could not be found or has been removed.</p>
        <Link href="/borrower/rentals">
          <Button variant="outline" className="rounded-xl mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Rental History
          </Button>
        </Link>
      </div>
    );
  }

  const product = rental.product;
  const owner = typeof rental.owner === 'object' ? rental.owner : null;
  const booking = typeof rental.booking === 'object' ? rental.booking : null;

  const rawStart = rental.startDate || rental.booking?.startDate;
  const rawEnd = rental.endDate || rental.booking?.endDate;
  const startDate = rawStart ? new Date(rawStart) : new Date();
  const endDate = rawEnd ? new Date(rawEnd) : new Date();
  const isPastDue = new Date() > endDate && rental.status === 'ACTIVE';

  return (
    <div className="container mx-auto px-4 md:px-8 py-8 md:py-12 max-w-5xl space-y-8 animate-in fade-in duration-300">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link 
          href="/borrower/rentals" 
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Rental History
        </Link>
      </div>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
              Rental Agreement
            </span>
            <span className="text-muted-foreground text-xs">•</span>
            <StatusBadge status={rental.status} />
          </div>
          <h1 className="text-3xl md:text-4xl font-light tracking-tight text-foreground">
            {product?.name || 'Equipment Rental'}
          </h1>
          <p className="text-xs font-mono text-muted-foreground mt-1">
            Reference ID: {rental._id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {owner?.email && (
            <a 
              href={`mailto:${owner.email}`}
              className="flex items-center gap-2 border border-border bg-card px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-muted transition-colors text-foreground"
            >
              <MessageSquare className="w-3.5 h-3.5 text-forest-primary" /> Contact Owner
            </a>
          )}
          {booking?._id && (
            <Link 
              href={`/booking/${booking._id}/confirmation`}
              className="flex items-center gap-2 border border-border bg-card px-4 py-2.5 rounded-xl text-xs uppercase tracking-widest font-bold hover:bg-muted transition-colors text-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5 text-forest-primary" /> Receipt
            </Link>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <div className={`p-8 rounded-3xl text-center flex flex-col items-center justify-center border ${
        rental.status === 'ACTIVE'
          ? 'bg-emerald-500/10 border-emerald-500/20 text-foreground'
          : rental.status === 'RETURN_REQUESTED'
          ? 'bg-amber-500/10 border-amber-500/30 text-foreground'
          : 'bg-card border-border text-foreground'
      }`}>
        {rental.status === 'ACTIVE' ? (
          <>
            <Clock className="w-8 h-8 mb-3 text-emerald-700" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-800 mb-2">
              Rental In Progress
            </div>
            <div className="text-2xl md:text-3xl font-light tracking-tight">
              Due Date: {formatDateDisplay(endDate)}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Please coordinate return with the owner prior to the end date to prevent late penalties.
            </p>
          </>
        ) : rental.status === 'RETURN_REQUESTED' ? (
          <>
            <Clock className="w-8 h-8 mb-3 text-amber-500" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-500 mb-2">
              Return Verification Pending
            </div>
            <div className="text-2xl md:text-3xl font-light tracking-tight">
              Awaiting Owner Confirmation
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              You submitted a return request. Once the owner inspects the gear and confirms receipt, the rental will be marked completed.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-8 h-8 mb-3 text-emerald-500" />
            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500 mb-2">
              Rental Completed
            </div>
            <div className="text-2xl md:text-3xl font-light tracking-tight">
              Item Returned & Closed
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              This rental is officially concluded. Thank you for renting with Rentable!
            </p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Product & Handover details */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-border bg-card rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground mb-6">
              Product Overview
            </h3>
            <div className="flex flex-col sm:flex-row gap-5">
              <div className="w-24 h-24 rounded-xl bg-muted border border-border shrink-0 flex items-center justify-center overflow-hidden">
                {product?.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-10 h-10 text-muted-foreground/40" />
                )}
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-xl text-foreground">{product?.name || 'Equipment'}</h4>
                <p className="text-sm text-muted-foreground">
                  Owner: <strong className="text-foreground">{owner?.fullName || 'Verified Owner'}</strong>
                </p>
                {product?.location && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-forest-primary" /> {product.location}
                  </p>
                )}
                {product?._id && (
                  <div className="pt-2">
                    <Link href={`/products/${product._id}`} className="text-xs uppercase tracking-widest font-bold text-forest-primary hover:underline">
                      View Full Listing →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border border-border bg-card rounded-2xl p-6 sm:p-8">
            <h3 className="text-base font-semibold uppercase tracking-wider text-foreground mb-4">
              Return Guidelines
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Please inspect the equipment before handover. Ensure all original accessories, batteries, lenses, charging cables, and packaging are included. Meet the owner at the designated handover spot.
            </p>
            <div className="bg-muted/40 p-5 rounded-xl border border-border text-sm space-y-2">
              <div className="flex items-center gap-2 text-foreground font-medium">
                <ShieldCheck className="w-4 h-4 text-forest-primary" />
                Deposit Protection Policy
              </div>
              <p className="text-xs text-muted-foreground">
                Your deposit is automatically preserved until the owner acknowledges receipt in sound working condition.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className="space-y-6">
          <div className="border border-border bg-card rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
              Rental Actions
            </h3>
            
            <div className="space-y-3">
              {rental.status === 'ACTIVE' && (
                <Button 
                  onClick={handleReturn}
                  disabled={isSubmitting || isRequestingReturn}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold shadow-xs"
                >
                  <ArrowRightCircle className="w-4 h-4" />
                  {isSubmitting || isRequestingReturn ? 'Submitting...' : 'Request Return'}
                </Button>
              )}

              {rental.status === 'RETURN_REQUESTED' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-800">
                    Return Requested
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Owner will mark the rental completed once verified.
                  </p>
                </div>
              )}

              {rental.status === 'COMPLETED' && product?._id && (
                <Link href={`/products/${product._id}`} className="block">
                  <Button variant="outline" className="w-full py-6 rounded-xl text-xs uppercase tracking-widest font-bold">
                    Rent Again
                  </Button>
                </Link>
              )}

              <Link href="/borrower/rentals" className="block">
                <Button variant="ghost" className="w-full py-6 rounded-xl border border-border text-xs uppercase tracking-widest font-bold">
                  All Rentals
                </Button>
              </Link>
            </div>
          </div>

          <div className="border border-red-500/20 bg-red-500/5 rounded-2xl p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" /> Need Assistance?
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
              If you experienced equipment malfunctions or have disagreements regarding returns or condition, our resolution team is here to assist.
            </p>
            <Link href="/messages">
              <Button variant="outline" className="w-full border-red-500/40 text-red-500 hover:bg-red-500/10 rounded-xl text-xs uppercase tracking-widest font-bold">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
