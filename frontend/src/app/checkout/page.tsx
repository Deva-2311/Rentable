'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, ChevronRight, Lock, MapPin, Calendar as CalendarIcon, Info } from 'lucide-react';
import { useProduct } from '@/features/products/api/useProducts';
import Image from 'next/image';
import Script from 'next/script';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dates, setDates] = useState({ start: '', end: '' });

  const { data: product, isLoading, isError } = useProduct(productId as string);

  useEffect(() => {
    if (productId) {
      router.replace(`/checkout/${productId}?${searchParams.toString()}`);
    }
  }, [productId, router, searchParams]);

  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-medium mb-4">No product selected</h1>
          <button onClick={() => router.push('/explore')} className="bg-foreground text-background px-6 py-2 uppercase tracking-widest text-xs font-bold hover:bg-foreground/90">
            Return to Explore
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-[#A9C5A0] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p>Error loading product details. Please try again.</p>
      </div>
    );
  }

  const startDate = new Date(dates.start);
  const endDate = new Date(dates.end);
  const days = (dates.start && dates.end && !isNaN(startDate.getTime()) && !isNaN(endDate.getTime()))
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
    : 0;

  const rentalTotal = product.pricePerDay * Math.max(days, 1);
  const platformFee = Math.floor(rentalTotal * 0.1);
  const totalAmount = rentalTotal + platformFee + product.securityDeposit;

  const handlePayment = async () => {
    if (!dates.start || !dates.end) {
      toast.error('Please select valid rental dates.');
      return;
    }
    
    setIsProcessing(true);
    try {
      // 1. Create Booking
      const bookingRes = await apiClient.post('/bookings', {
        product: product._id,
        startDate: new Date(dates.start).toISOString(),
        endDate: new Date(dates.end).toISOString(),
      });
      const booking = bookingRes.data.data;

      // 2. Create Razorpay Order
      const orderRes = await apiClient.post('/payments/create-order', {
        bookingId: booking._id,
      });
      const orderData = orderRes.data.data;

      // 3. Initialize Razorpay Modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock', 
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Rentable',
        description: `Rental for ${product.name}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            toast.loading('Verifying payment...', { id: 'payment' });
            // 4. Verify Payment
            await apiClient.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            toast.success('Payment successful!', { id: 'payment' });
            router.push(`/booking/${booking._id}/confirmation`);
          } catch (verifyError: any) {
            toast.error(verifyError?.response?.data?.message || 'Payment verification failed', { id: 'payment' });
          }
        },
        prefill: {
          name: 'Borrower',
          email: 'borrower@rentable.com',
          contact: '9999999999',
        },
        theme: {
          color: '#A9C5A0',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error('Payment failed or cancelled.');
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-card/30 pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-12">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Secure Checkout</p>
            <h1 className="text-3xl md:text-4xl font-light">Complete your booking.</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-7 space-y-8">
              
              <div className={`border border-border bg-card p-6 md:p-8 transition-all ${step === 1 ? 'ring-1 ring-[#A9C5A0]' : 'opacity-70'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">1</span>
                    Rental Dates
                  </h2>
                  {step > 1 && (
                    <button onClick={() => setStep(1)} className="text-xs uppercase tracking-widest text-[#A9C5A0] hover:text-[#C5EFCB]">Edit</button>
                  )}
                </div>
                
                {step === 1 ? (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">Start Date</label>
                        <input type="date" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-[#A9C5A0] outline-none" onChange={(e) => setDates({ ...dates, start: e.target.value })} value={dates.start} />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">End Date</label>
                        <input type="date" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-[#A9C5A0] outline-none" onChange={(e) => setDates({ ...dates, end: e.target.value })} value={dates.end} />
                      </div>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      disabled={!dates.start || !dates.end}
                      className="w-full bg-foreground text-background py-4 text-xs uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-foreground/90 transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {dates.start} to {dates.end} ({days} days)
                  </div>
                )}
              </div>

              <div className={`border border-border bg-card p-6 md:p-8 transition-all ${step === 2 ? 'ring-1 ring-[#A9C5A0]' : 'opacity-50 pointer-events-none'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">2</span>
                    Payment Details
                  </h2>
                </div>
                
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="bg-[#A9C5A0]/10 border border-[#A9C5A0]/20 p-4 flex gap-3 text-sm text-[#A9C5A0]">
                      <ShieldCheck className="w-5 h-5 shrink-0" />
                      <p>Your payment is processed securely. The security deposit is held and not charged unless there is damage.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="border border-border p-4 flex items-center gap-4 cursor-pointer hover:border-[#A9C5A0] transition-colors bg-[#A9C5A0]/5">
                        <div className="w-4 h-4 rounded-full border-2 border-[#A9C5A0] flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-[#A9C5A0]" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">UPI / Net Banking / Cards</div>
                          <div className="text-xs text-muted-foreground">Processed by Razorpay</div>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold disabled:opacity-70 hover:bg-foreground/90 transition-all group"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          Pay Securely (₹{totalAmount.toLocaleString()})
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>

            <div className="lg:col-span-5">
              <div className="border border-border bg-card p-6 md:p-8 sticky top-24">
                <h3 className="text-lg font-medium mb-6">Booking Summary</h3>
                
                <div className="flex gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-24 h-24 bg-background border border-border relative overflow-hidden shrink-0">
                    {product.images?.[0] && (
                      <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">{product.category?.name || 'Category'}</div>
                    <div className="font-medium leading-tight mb-2">{product.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {product.location}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 text-sm mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">₹{product.pricePerDay.toLocaleString()} x {days || 0} days</span>
                    <span>₹{rentalTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>₹{platformFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-border border-dashed">
                    <span className="flex items-center gap-1 font-medium">
                      Refundable Deposit
                      <Info className="w-3 h-3 text-muted-foreground" />
                    </span>
                    <span className="font-medium">₹{product.securityDeposit.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Total Due</div>
                    <div className="text-2xl font-light">₹{totalAmount.toLocaleString()}</div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground text-center leading-relaxed">
                  By confirming this booking, you agree to the RENTABLE Terms of Service, Cancellation Policy, and Owner&apos;s Rental Rules.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <CheckoutContent />
    </Suspense>
  );
}
