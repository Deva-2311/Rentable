"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronLeft, Lock, ShieldCheck, CreditCard, ChevronRight, AlertCircle, Calendar as CalendarIcon, UserCheck, AlertTriangle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useProduct } from "@/features/products/api/useProducts";
import { useCreateBooking } from "@/features/bookings/api/useBookings";
import { useAuth } from "@/lib/auth/AuthContext";
import { Product } from "@/types/product";
import Link from "next/link";
import apiClient from "@/lib/api/client";
import { formatDateDisplay } from "@/lib/date-utils";

export default function CheckoutClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeSimulationMode, setActiveSimulationMode] = useState<'success' | 'failed'>('success');

  // Borrower details
  const [borrowerName, setBorrowerName] = useState(user?.fullName || "");
  const [borrowerPhone, setBorrowerPhone] = useState(user?.phone || "9876543210");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  useEffect(() => {
    if (startParam && endParam) {
      const cleanStart = startParam.includes('T') ? startParam.split('T')[0] : startParam;
      const cleanEnd = endParam.includes('T') ? endParam.split('T')[0] : endParam;
      setStartDate(new Date(cleanStart + 'T00:00:00'));
      setEndDate(new Date(cleanEnd + 'T00:00:00'));
    } else {
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);
      setStartDate(today);
      setEndDate(threeDaysLater);
    }
  }, [startParam, endParam]);

  useEffect(() => {
    if (user?.fullName && !borrowerName) {
      setBorrowerName(user.fullName);
    }
    if (user?.phone && !borrowerPhone) {
      setBorrowerPhone(user.phone);
    }
  }, [user, borrowerName, borrowerPhone]);

  const { data: apiProduct, isLoading } = useProduct(id);
  const product = apiProduct as Product | undefined;
  const { mutateAsync: createBooking } = useCreateBooking();

  if (isLoading || !startDate || !endDate) {
    return (
      <div className="w-full min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen pt-20 flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-heading font-medium">Product Not Found</h2>
        <button onClick={() => router.back()} className="mt-4 text-primary font-semibold text-sm hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  const duration = Math.max(1, differenceInDays(endDate, startDate));
  const rentalAmount = duration * product.pricePerDay;
  const platformFee = Math.round(rentalAmount * 0.1);
  const securityDeposit = product.securityDeposit || 0;
  const total = rentalAmount + securityDeposit + platformFee;

  const handleSimulatePayment = async (simulationStatus: 'success' | 'failed') => {
    if (!user) {
      toast.error("Please log in to complete your checkout.");
      router.push(`/login?returnUrl=/checkout/${id}?start=${format(startDate, "yyyy-MM-dd")}&end=${format(endDate, "yyyy-MM-dd")}`);
      return;
    }

    if (!borrowerName.trim() || borrowerName.trim().length < 2) {
      toast.error("Please enter a valid borrower name (min 2 characters).");
      return;
    }

    if (!borrowerPhone.trim() || borrowerPhone.trim().replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }
    
    setIsProcessing(true);
    setActiveSimulationMode(simulationStatus);

    try {
      // 1. Create Booking
      const formattedStart = format(startDate, "yyyy-MM-dd");
      const formattedEnd = format(endDate, "yyyy-MM-dd");
      
      const booking = await createBooking({ 
        product: id, 
        startDate: formattedStart, 
        endDate: formattedEnd 
      });

      if (!booking || (!booking.bookingId && !booking._id)) {
        throw new Error("Failed to create booking reference");
      }

      const bookingIdToUse = booking._id;

      // 2. Simulate Payment (Success or Failure as chosen)
      await apiClient.post('/payments/simulate', {
        bookingId: bookingIdToUse,
        amount: total,
        simulationStatus,
      });

      if (simulationStatus === 'success') {
        toast.success(`Payment verified! Booking ${booking.bookingId || ''} confirmed.`);
        router.push(`/booking/${bookingIdToUse}/confirmation`);
      }
      
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Checkout failed. Please try again.";
      if (simulationStatus === 'failed') {
        toast.error(`Demo Failure Verified: ${errorMsg}`);
      } else {
        toast.error(errorMsg);
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background min-h-screen pt-16">
      
      {/* Checkout Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <Link href={`/products/${id}`} className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Product
          </Link>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Lock className="w-4 h-4" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Checkout Area */}
      <main className="max-w-[1100px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* LEFT: Details & Payment */}
          <div className="md:col-span-7 space-y-8">
            
            {/* Step 1: Borrower Details */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <UserCheck className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-heading font-medium text-foreground">1. Borrower Information</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Verify recipient contact details for equipment collection and handover.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Full Name *</label>
                  <input 
                    type="text" 
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Phone Number *</label>
                  <input 
                    type="tel" 
                    value={borrowerPhone}
                    onChange={(e) => setBorrowerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Pickup / Delivery Instructions (Optional)</label>
                  <input 
                    type="text" 
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="e.g. Will collect equipment after 2 PM"
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Step 2: Rental Dates */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-heading font-medium text-foreground">2. Rental Period</h2>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                  {duration} {duration === 1 ? 'day' : 'days'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Start Date</label>
                  <input 
                    type="date"
                    value={format(startDate, 'yyyy-MM-dd')}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (e.target.value) {
                        const newStart = new Date(e.target.value + 'T00:00:00');
                        setStartDate(newStart);
                        if (endDate && endDate <= newStart) {
                          const nextDay = new Date(newStart);
                          nextDay.setDate(nextDay.getDate() + 1);
                          setEndDate(nextDay);
                        }
                      }
                    }}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Return Date</label>
                  <input 
                    type="date"
                    value={format(endDate, 'yyyy-MM-dd')}
                    min={format(startDate, 'yyyy-MM-dd')}
                    onChange={(e) => {
                      if (e.target.value) {
                        setEndDate(new Date(e.target.value + 'T00:00:00'));
                      }
                    }}
                    className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </section>

            {/* Step 3: Payment Simulation Panel */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-heading font-medium text-foreground">3. Payment & Simulation (Demo Mode)</h2>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clearly labelled academic demo payment gateway. Choose whether to simulate a successful payment or simulate a failure to verify error handling.
                </p>
              </div>

              {/* Demo Mode Badge */}
              <div className="flex items-start gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs text-foreground leading-relaxed">
                  <span className="font-bold text-primary uppercase tracking-wider block mb-1">Academic Demonstration Mode</span>
                  No actual banking credentials or funds will be charged. Payment transactions and booking states are securely recorded and validated against the local MongoDB database.
                </div>
              </div>

              {/* Card preview */}
              <div className="space-y-3 bg-secondary/30 p-4 rounded-lg border border-border">
                <div className="flex justify-between items-center text-xs font-semibold text-muted-foreground">
                  <span>Simulated Card</span>
                  <span className="text-[10px] uppercase tracking-wider bg-secondary px-2 py-0.5 rounded">Demo Gateway</span>
                </div>
                <input 
                  type="text" 
                  value="4242 •••• •••• 4242" 
                  disabled 
                  className="w-full px-3 py-2 bg-secondary border border-border rounded text-sm text-muted-foreground cursor-not-allowed font-mono"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="text" 
                    value="Exp: 12/28" 
                    disabled 
                    className="px-3 py-2 bg-secondary border border-border rounded text-sm text-muted-foreground cursor-not-allowed font-mono"
                  />
                  <input 
                    type="text" 
                    value="CVC: 123" 
                    disabled 
                    className="px-3 py-2 bg-secondary border border-border rounded text-sm text-muted-foreground cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              {/* Simulation Action Buttons */}
              <div className="space-y-3 pt-2">
                <button 
                  onClick={() => handleSimulatePayment('success')}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing && activeSimulationMode === 'success' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      <span>Verifying & Persisting Booking...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Simulate Payment (Success Demo) — ₹{total.toLocaleString()}</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <button 
                  onClick={() => handleSimulatePayment('failed')}
                  disabled={isProcessing}
                  className="w-full py-3 rounded-lg border border-destructive/50 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing && activeSimulationMode === 'failed' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin"></div>
                      <span>Simulating Card Failure...</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      <span>Simulate Payment Failure (Test Error Handling)</span>
                    </>
                  )}
                </button>
              </div>

            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="md:col-span-5">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-heading font-medium text-foreground mb-4">Itemized Order Summary</h2>
              
              {/* Product Preview */}
              <div className="flex gap-4 items-start pb-5 border-b border-border">
                <div className="w-20 h-20 rounded-lg bg-secondary overflow-hidden relative shrink-0 border border-border">
                  {product.images && product.images[0] && (
                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground line-clamp-2">{product.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{product.category?.name || 'Equipment'}</p>
                  <p className="text-xs text-muted-foreground mt-1">₹{product.pricePerDay.toLocaleString()} / day</p>
                </div>
              </div>

              {/* Dates */}
              <div className="py-4 border-b border-border flex justify-between items-center text-sm">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground">Pickup</p>
                  <p className="font-medium text-foreground mt-0.5">{formatDateDisplay(startDate)}</p>
                </div>
                <div className="w-8 h-[1px] bg-border mx-2"></div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-muted-foreground">Return</p>
                  <p className="font-medium text-foreground mt-0.5">{formatDateDisplay(endDate)}</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="py-4 space-y-2.5 text-sm text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Rental Subtotal ({duration} {duration === 1 ? 'day' : 'days'} × ₹{product.pricePerDay.toLocaleString()})</span>
                  <span className="text-foreground font-medium">₹{rentalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Platform Escrow Fee (10%)</span>
                  <span className="text-foreground font-medium">₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-foreground">Refundable Security Deposit</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400">100% refunded after return inspection</span>
                  </div>
                  <span className="text-foreground font-medium">₹{securityDeposit.toLocaleString()}</span>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-border flex justify-between items-center mb-6">
                <div>
                  <span className="text-base font-semibold text-foreground block">Total to Pay</span>
                  <span className="text-[10px] text-muted-foreground">Inclusive of taxes & platform escrow</span>
                </div>
                <span className="text-2xl font-heading font-medium text-foreground">
                  ₹{total.toLocaleString()}
                </span>
              </div>

              <div className="text-[10px] text-center text-muted-foreground leading-relaxed">
                By confirming, you agree to RENTABLE rental terms, cancellation policy, and damage cover agreement.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
