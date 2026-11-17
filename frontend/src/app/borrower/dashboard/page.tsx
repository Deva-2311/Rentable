"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyBookings, useUpdateBookingStatus } from "@/features/bookings/api/useBookings";
import { useActiveRentals, useRequestReturn } from "@/features/rentals/api/useRentals";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { XCircle, Calendar, MapPin, ArrowRight } from "lucide-react";
import { PaymentButton } from "@/components/payment/PaymentButton";
import Link from "next/link";
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from "@/lib/date-utils";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-500",
  ACTIVE: "text-green-500",
  CANCELLED: "text-muted-foreground line-through",
  REJECTED: "text-red-500 line-through",
  COMPLETED: "text-muted-foreground",
  RETURNED: "text-muted-foreground",
};

export default function BorrowerDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: bookingsData, isLoading: bookingsLoading } = useMyBookings();
  const { data: rentalsData, isLoading: rentalsLoading } = useActiveRentals();
  const { mutateAsync: updateBooking } = useUpdateBookingStatus();
  const { mutateAsync: requestReturn } = useRequestReturn();

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [returningId, setReturningId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "borrower") { router.push("/"); return; }
  }, [user, router]);

  const bookings = bookingsData || [];
  const activeRentals = rentalsData || [];
  const isLoading = bookingsLoading || rentalsLoading;

  const handleCancel = async (bookingId: string) => {
    setCancellingId(bookingId);
    try {
      await updateBooking({ id: bookingId, action: "cancel" });
      toast.success("Booking cancelled successfully");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const handleReturnRequest = async (rentalId: string) => {
    setReturningId(rentalId);
    try {
      await requestReturn(rentalId);
      toast.success("Return requested successfully");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to request return");
    } finally {
      setReturningId(null);
    }
  };

  const pending = bookings.filter((b) => b.status === "PENDING").length;
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED").length;

  if (isLoading) return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16 animate-pulse">
      <div className="h-10 w-64 bg-muted" />
      <div className="h-32 w-full bg-muted border border-border" />
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-16 w-full border-b border-border bg-muted/20" />)}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-6xl min-h-screen">
      
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-foreground">Good morning, {user?.fullName?.split(' ')[0] || 'Borrower'}.</h1>
          <p className="text-muted-foreground font-normal text-lg">Here is the status of your rentals and requests.</p>
        </div>
        <div className="flex gap-8 text-sm bg-card p-6 rounded-2xl border border-border shadow-xs">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active</p>
            <p className="text-2xl font-bold text-primary">{activeRentals.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl font-bold text-foreground">{pending}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-800">{confirmed}</p>
          </div>
        </div>
      </div>

      {/* ACTIVE RENTALS (Primary Focus) */}
      {activeRentals.length > 0 && (
        <div className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Current Rental</h2>
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-xs">
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className={`text-[10px] uppercase tracking-widest font-bold mb-3 ${activeRentals[0].status === 'RETURN_REQUESTED' ? 'text-amber-800' : 'text-primary'}`}>
                  {activeRentals[0].status}
                </p>
                <h3 className="text-3xl md:text-4xl font-semibold text-foreground mb-3">{activeRentals[0].product?.name || "Product"}</h3>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium text-sm">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" />
                    Pickup: <strong className="text-foreground font-semibold">{formatDateDisplay(activeRentals[0].startDate)}</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Return: <strong className="text-foreground font-semibold">{formatDateDisplay(activeRentals[0].endDate)}</strong>
                  </span>
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">
                    {formatDurationDisplay(calculateDurationDays(activeRentals[0].startDate, activeRentals[0].endDate))}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-left md:text-right w-full md:w-auto">
                <div className="p-6 bg-secondary/40 rounded-2xl shadow-xs border border-border">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 font-bold">RETURN DEADLINE</p>
                  <p className="text-2xl font-serif italic text-primary font-semibold">{formatDateDisplay(activeRentals[0].endDate)}</p>
                </div>
                {activeRentals[0].status === 'ACTIVE' ? (
                  <Button
                    onClick={() => handleReturnRequest(activeRentals[0]._id)}
                    disabled={returningId === activeRentals[0]._id}
                    className="rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 h-14 w-full shadow-md transition-all"
                  >
                    {returningId === activeRentals[0]._id ? "Requesting..." : "Request Return"}
                  </Button>
                ) : (
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary py-4 px-6 rounded-xl border border-border text-center">
                    Pending Owner Confirmation
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {activeRentals.length > 1 && (
            <div className="mt-6 text-sm text-muted-foreground font-medium">
              + {activeRentals.length - 1} other active rental{activeRentals.length - 1 !== 1 ? 's' : ''} (check history)
            </div>
          )}
        </div>
      )}

      {/* ALL BOOKINGS LIST */}
      <div>
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">All Requests & Rentals</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-32 rounded-3xl border border-border bg-card">
            <p className="text-2xl font-medium mb-4">No rentals yet.</p>
            <p className="text-muted-foreground mb-8">You haven&apos;t requested any products to rent.</p>
            <Link href="/explore">
              <Button className="rounded-xl h-12 px-8 bg-primary text-primary-foreground font-medium hover:bg-primary/90 shadow-md">
                Explore The Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div key={booking._id} className="p-6 md:p-8 rounded-2xl border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-xs transition-shadow">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-xl text-foreground">{booking.product?.name || "Product"}</h4>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                      booking.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/20" :
                      booking.status === "PENDING" ? "bg-amber-500/15 text-amber-800 border border-amber-500/20" :
                      booking.status === "CONFIRMED" ? "bg-blue-500/15 text-blue-800 border border-blue-500/20" :
                      "bg-secondary text-muted-foreground border border-border"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-2 mt-3 text-sm text-muted-foreground font-medium">
                    {booking.product?.location && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-primary" /> {booking.product.location}
                      </span>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                        <span>Pickup: <strong className="text-foreground font-semibold">{formatDateDisplay(booking.startDate)}</strong></span>
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Return: <strong className="text-foreground font-semibold">{formatDateDisplay(booking.endDate)}</strong>
                      </span>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                        {formatDurationDisplay(booking.duration || calculateDurationDays(booking.startDate, booking.endDate))}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between md:h-full gap-4 w-full md:w-auto">
                  <div className="md:text-right flex items-center justify-between md:block w-full">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                    <p className="font-semibold text-xl text-foreground">{formatCurrency(booking.totalAmount)}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end mt-2 md:mt-0">
                    {booking.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-border text-xs font-medium h-10 px-4 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancel(booking._id)}
                      >
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel Request"}
                      </Button>
                    )}
                    
                    {booking.status === "CONFIRMED" && booking.paymentStatus !== "PAID" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs font-medium h-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl"
                          disabled={cancellingId === booking._id}
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </Button>
                        <PaymentButton bookingId={booking._id} amount={booking.totalAmount} />
                      </>
                    )}

                    {(booking.status === "ACTIVE" || (booking.status === "CONFIRMED" && booking.paymentStatus === "PAID")) && (
                      <Link href="/borrower/rentals" className="text-xs font-semibold text-emerald-800 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors">
                        Active Rental <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    
                    {(booking.status === "COMPLETED" || booking.status === "RETURNED" || booking.status === "CANCELLED" || booking.status === "REJECTED") && (
                      <Link href={`/products/${booking.product?._id}`} className="text-xs font-semibold text-foreground hover:text-primary flex items-center gap-1 transition-colors bg-secondary px-4 py-2 rounded-xl border border-border">
                        View Product <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
                
                {booking.status === "CONFIRMED" && booking.paymentStatus !== "PAID" && (
                  <div className="w-full md:hidden text-[10px] font-bold uppercase tracking-widest text-blue-800 mt-2 p-3 bg-blue-500/15 border border-blue-500/20 rounded-xl">
                    Payment required to start rental
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
