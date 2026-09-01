"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useMyBookings, useUpdateBookingStatus } from "@/features/bookings/api/useBookings";
import { useActiveRentals } from "@/features/rentals/api/useRentals";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { XCircle, Calendar, MapPin, ArrowRight } from "lucide-react";
import { PaymentButton } from "@/components/payment/PaymentButton";
import Link from "next/link";

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

  const [cancellingId, setCancellingId] = useState<string | null>(null);

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
    <div className="container mx-auto px-4 py-16 max-w-5xl min-h-screen">
      
      <div className="mb-20 pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">Good morning, {user?.fullName?.split(' ')[0] || 'Borrower'}.</h1>
          <p className="text-muted-foreground font-light">Here is the status of your rentals and requests.</p>
        </div>
        <div className="flex gap-8 text-sm">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active</p>
            <p className="text-xl font-medium">{activeRentals.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending</p>
            <p className="text-xl font-medium">{pending}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Confirmed</p>
            <p className="text-xl font-medium">{confirmed}</p>
          </div>
        </div>
      </div>

      {/* ACTIVE RENTALS (Primary Focus) */}
      {activeRentals.length > 0 && (
        <div className="mb-20">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Current Rental</h2>
          <div className="border border-border bg-card overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-2">ACTIVE</p>
                <h3 className="text-3xl font-light mb-2">{activeRentals[0].product?.name || "Product"}</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(activeRentals[0].startDate).toLocaleDateString()} – {new Date(activeRentals[0].endDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-left md:text-right w-full md:w-auto p-6 bg-background border border-border">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">RETURN IN</p>
                <p className="text-4xl font-serif italic text-primary">02 DAYS</p>
                <p className="text-xs text-muted-foreground mt-1">14 HOURS 32 MINUTES</p>
              </div>
            </div>
          </div>
          
          {activeRentals.length > 1 && (
            <div className="mt-4 text-sm text-muted-foreground">
              + {activeRentals.length - 1} other active rental{activeRentals.length - 1 !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {/* ALL BOOKINGS LIST */}
      <div>
        <div className="flex justify-between items-end mb-6 pb-2 border-b border-border">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">All Requests & Rentals</h2>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-20 border border-border bg-card">
            <p className="text-2xl font-light mb-4">No rentals yet.</p>
            <p className="text-muted-foreground mb-8">You haven't requested any products to rent.</p>
            <Link href="/explore">
              <Button className="rounded-sm uppercase tracking-widest text-xs h-10 px-8 bg-foreground text-background hover:bg-foreground/90">
                Explore The Collection
              </Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col border border-border bg-card">
            {bookings.map((booking, index) => (
              <div key={booking._id} className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-colors ${index !== bookings.length - 1 ? 'border-b border-border/50' : ''}`}>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium text-lg">{booking.product?.name || "Product"}</h4>
                    <span className={`text-[10px] uppercase tracking-widest font-bold ${STATUS_COLORS[booking.status] || "text-foreground"}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center gap-x-6 gap-y-1 mt-2 text-xs text-muted-foreground">
                    {booking.product?.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {booking.product.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(booking.startDate).toLocaleDateString()} – {new Date(booking.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col md:items-end justify-between md:h-full gap-4 w-full md:w-auto">
                  <div className="md:text-right">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                    <p className="font-medium text-lg">₹{booking.totalAmount?.toLocaleString()}</p>
                  </div>
                  
                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {booking.status === "PENDING" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-sm border-border text-xs uppercase tracking-widest h-8 hover:text-red-500 hover:border-red-500/50"
                        disabled={cancellingId === booking._id}
                        onClick={() => handleCancel(booking._id)}
                      >
                        {cancellingId === booking._id ? "Cancelling..." : "Cancel Request"}
                      </Button>
                    )}
                    
                    {booking.status === "CONFIRMED" && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs uppercase tracking-widest h-8 text-muted-foreground hover:text-red-500"
                          disabled={cancellingId === booking._id}
                          onClick={() => handleCancel(booking._id)}
                        >
                          Cancel
                        </Button>
                        <PaymentButton bookingId={booking._id} amount={booking.totalAmount} />
                      </>
                    )}
                    
                    {(booking.status === "COMPLETED" || booking.status === "RETURNED" || booking.status === "CANCELLED" || booking.status === "REJECTED") && (
                      <Link href={`/products/${booking.product?._id}`} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                        View Product <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </div>
                
                {booking.status === "CONFIRMED" && (
                  <div className="w-full md:hidden text-[10px] uppercase tracking-widest text-blue-500 mt-2">
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
