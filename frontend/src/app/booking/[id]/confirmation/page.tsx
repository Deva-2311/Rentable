'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle, MapPin, Calendar, ArrowRight, Download, MessageSquare, Package } from 'lucide-react';
import Link from 'next/link';
import { useBooking } from '@/features/bookings/api/useBookings';
import { formatDateDisplay, formatDurationDisplay } from '@/lib/date-utils';

export default function BookingConfirmationPage() {
  const params = useParams();
  const bookingId = params.id as string;
  const { data: booking, isLoading, isError } = useBooking(bookingId);

  const formattedStart = formatDateDisplay(booking?.startDate);
  const formattedEnd = formatDateDisplay(booking?.endDate);
  const product = booking?.product as any;
  const owner = booking?.owner as any;

  return (
    <div className="min-h-screen bg-card/30 pt-24 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Success Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-4">Payment & Booking Verified</p>
          <h1 className="text-4xl md:text-5xl font-light mb-4">Booking Confirmed.</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your rental has been successfully persisted in the system. The owner has been notified.
          </p>
        </div>

        {/* Booking Card */}
        <div className="border border-border bg-card p-8 md:p-10 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 rounded-xl shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6 mb-8 pb-8 border-b border-border">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Booking Reference</div>
              <div className="text-xl font-mono text-primary font-bold">
                {booking?.bookingId || bookingId}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Status</div>
              <div className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                {booking?.status || 'Confirmed'}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Amount Paid</div>
              <div className="text-xl font-medium text-foreground">
                ₹{(booking?.totalAmount || 0).toLocaleString()}
              </div>
            </div>
          </div>

          {/* Product Details */}
          {product && (
            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
              <div className="w-16 h-16 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border">
                {product.images?.[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                ) : (
                  <Package className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Owner: {owner?.fullName || 'Equipment Partner'}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Dates & Duration</div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-foreground">
                    <span className="text-muted-foreground font-normal">Pickup: </span>{formattedStart}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    <span className="text-muted-foreground font-normal">Return: </span>{formattedEnd}
                  </div>
                  <div className="text-xs text-primary font-bold pt-0.5">
                    {formatDurationDisplay(booking?.duration)}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-4">Pickup Location</div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{product?.location || 'Central Depot'}</div>
                  <div className="text-sm text-muted-foreground">Address confirmed with booking receipt</div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/messages" className="flex-1 flex items-center justify-center gap-2 border border-border bg-secondary py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-muted transition-colors">
              <MessageSquare className="w-4 h-4" /> Message Owner
            </Link>
            <Link href="/borrower/dashboard" className="flex-1 flex items-center justify-center gap-2 border border-primary bg-primary text-primary-foreground py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors">
              View In Dashboard
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-center animate-in fade-in duration-700 delay-300">
          <Link href="/borrower/dashboard" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-foreground hover:text-primary transition-colors group">
            Go to My Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
