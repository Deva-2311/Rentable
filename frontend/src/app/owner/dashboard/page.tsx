"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useOwnerStats, useOwnerBookings, useOwnerProducts } from "@/features/owner/api/useOwner";
import { useUpdateBookingStatus } from "@/features/bookings/api/useBookings";
import { useActiveRentals, useCompleteRental } from "@/features/rentals/api/useRentals";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, Package, Clock, CheckCircle2, XCircle, Layers } from "lucide-react";
import { CreateProductModal } from "@/components/products/CreateProductModal";
import { EditProductModal } from "@/components/products/EditProductModal";
import { BentoBlock } from "@/components/ui/bento-block";
import { 
  formatDateDisplay, 
  calculateDurationDays, 
  formatDurationDisplay, 
  formatCurrency 
} from "@/lib/date-utils";

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useOwnerStats();
  const { data: bookingsData, isLoading: bookingsLoading, refetch: refetchBookings } = useOwnerBookings();
  const { data: productsData, isLoading: productsLoading, refetch: refetchProducts } = useOwnerProducts();
  const { data: rentalsData, isLoading: rentalsLoading, refetch: refetchRentals } = useActiveRentals();
  const { mutateAsync: updateBooking } = useUpdateBookingStatus();
  const { mutateAsync: completeRental } = useCompleteRental();

  const [actionId, setActionId] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "products">("overview");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/"); return; }
  }, [user, router]);

  const bookings = bookingsData || [];
  const products = productsData || [];
  const activeRentals = rentalsData || [];
  const isLoading = statsLoading || bookingsLoading || productsLoading || rentalsLoading;

  const handleAction = async (bookingId: string, action: "accept" | "reject") => {
    setActionId(bookingId);
    try {
      await updateBooking({ id: bookingId, action });
      toast.success(`Booking ${action === "accept" ? "accepted" : "rejected"} successfully`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Action failed");
    } finally {
      setActionId(null);
    }
  };

  const handleCompleteRental = async (rentalId: string) => {
    setCompletingId(rentalId);
    try {
      await completeRental(rentalId);
      toast.success("Return confirmed successfully");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to confirm return");
    } finally {
      setCompletingId(null);
    }
  };

  if (isLoading) return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-6xl space-y-16 animate-pulse">
      <div className="h-12 w-64 bg-muted rounded-2xl" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="h-32 w-full bg-muted rounded-3xl" />
         <div className="h-32 w-full bg-muted rounded-3xl" />
         <div className="h-32 w-full bg-muted rounded-3xl" />
      </div>
      <div className="h-96 w-full bg-muted rounded-3xl" />
    </div>
  );

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <>
    <div className="container mx-auto px-4 pt-24 md:pt-32 pb-32 max-w-6xl min-h-screen">
      
      {/* ── HEADER ── */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-foreground">Owner Dashboard</h1>
          <p className="text-muted-foreground font-normal text-lg">Manage your listings, earnings, and requests.</p>
        </div>
        <div>
          <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-primary text-primary-foreground h-12 px-6 hover:bg-primary/90 shadow-md">
            <Plus className="h-5 w-5 mr-2" /> List New Item
          </Button>
        </div>
      </div>

      {/* ── BENTO ANALYTICS ── */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <BentoBlock size="small" variant="dark" className="p-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/70">Total Earnings</p>
            </div>
            <p className="text-4xl font-semibold text-white">₹{(stats.totalEarnings || 0).toLocaleString()}</p>
          </BentoBlock>

          <BentoBlock size="small" className="p-8 bg-card border-border shadow-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Listed Gear</p>
            </div>
            <p className="text-4xl font-semibold text-foreground">{stats.myProducts ?? products.length}</p>
          </BentoBlock>
          
          <BentoBlock size="small" className="p-8 bg-card border-border shadow-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Rentals</p>
            </div>
            <p className="text-4xl font-semibold text-foreground">{stats.activeRentals}</p>
          </BentoBlock>
          
          <BentoBlock size="small" className="p-8 bg-card border-border shadow-xs">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-800" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Requests</p>
            </div>
            <p className="text-4xl font-semibold text-foreground">{stats.pendingRequests}</p>
          </BentoBlock>
        </div>
      )}

      {/* ── TABS ── */}
      <div className="flex gap-8 md:gap-12 mb-12 border-b border-border">
        {(["overview", "requests", "products"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px relative ${
              activeTab === tab 
                ? "border-forest-primary text-forest-primary" 
                : "border-transparent text-forest-muted-sage hover:text-forest-dark"
            }`}
          >
            {tab}
            {tab === "requests" && pendingBookings.length > 0 && (
              <span className="absolute -top-1 -right-4 text-[10px] bg-yellow-500 text-white rounded-full w-4 h-4 flex items-center justify-center font-bold">
                {pendingBookings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === "overview" && (
        <div className="space-y-12">
          
          {/* Action Required */}
          {pendingBookings.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-forest-muted-sage mb-6">Action Required</h2>
              <div className="flex flex-col gap-4">
                {pendingBookings.slice(0, 3).map((b) => (
                  <div key={b._id} className="p-6 md:p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-xl">{b.product?.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-yellow-500/10 text-yellow-600 rounded-full">
                          PENDING
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-forest-muted-sage font-medium mt-1">
                        <span>By: <strong className="text-forest-dark">{b.borrower?.fullName || 'Borrower'}</strong></span>
                        <span>•</span>
                        <span>Pickup: <strong className="text-forest-dark">{formatDateDisplay(b.startDate)}</strong></span>
                        <span>•</span>
                        <span>Return: <strong className="text-forest-dark">{formatDateDisplay(b.endDate)}</strong></span>
                        <span className="text-[10px] bg-yellow-500/10 text-yellow-700 font-bold px-2 py-0.5 rounded-full">
                          {formatDurationDisplay(b.duration || calculateDurationDays(b.startDate, b.endDate))}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between gap-4 w-full md:w-auto">
                      <div className="md:text-right flex items-center justify-between md:block w-full">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1 font-bold">Rental Earnings</p>
                        <p className="font-semibold text-xl text-foreground">{formatCurrency(b.rentalAmount || (b.product?.pricePerDay * (b.duration || 1)))}</p>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "reject")}
                          className="rounded-xl border-border text-xs font-medium h-10 px-4 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "accept")}
                          className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-10 px-6 hover:bg-primary/90 shadow-md"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pendingBookings.length > 3 && (
                <button onClick={() => setActiveTab("requests")} className="text-sm font-semibold text-primary hover:text-foreground mt-6 transition-colors">
                  View {pendingBookings.length - 3} more pending requests →
                </button>
              )}
            </div>
          )}

          {/* Active Rentals */}
          {activeRentals.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Rentals Out</h2>
              <div className="flex flex-col gap-4">
                {activeRentals.map((r) => (
                  <div key={r._id} className="p-6 md:p-8 rounded-2xl border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-xl text-foreground">{r.product?.name}</h4>
                        <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                          r.status === 'RETURN_REQUESTED' ? 'bg-amber-500/15 text-amber-800 border border-amber-500/20' : 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium mt-1">
                        <span>Rented by: <strong className="text-foreground font-semibold">{r.borrower?.fullName || 'Borrower'}</strong></span>
                        <span>•</span>
                        <span>Return Due: <strong className="text-primary font-semibold">{formatDateDisplay(r.endDate || r.booking?.endDate)}</strong></span>
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-between md:h-full gap-4 w-full md:w-auto">
                      {r.status === 'RETURN_REQUESTED' ? (
                        <Button
                          disabled={completingId === r._id}
                          onClick={() => handleCompleteRental(r._id)}
                          className="rounded-xl bg-primary text-primary-foreground text-sm font-semibold h-12 px-8 hover:bg-primary/90 shadow-md"
                        >
                          {completingId === r._id ? "Confirming..." : "Confirm Return"}
                        </Button>
                      ) : (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-secondary py-3 px-4 rounded-xl border border-border">
                          Waiting for return
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── REQUESTS TAB ── */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-32 rounded-3xl border border-border bg-card">
              <p className="text-2xl font-medium mb-4 text-foreground">No requests yet.</p>
              <p className="text-muted-foreground">When someone wants to rent your items, it will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {bookings.map((b) => (
                <div key={b._id} className="p-6 md:p-8 rounded-2xl border border-border bg-card flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xs hover:shadow-sm transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-xl text-foreground">{b.product?.name}</h4>
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full ${
                        b.status === "PENDING" ? "bg-amber-500/15 text-amber-800 border border-amber-500/20" :
                        b.status === "ACTIVE" ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/20" :
                        b.status === "CONFIRMED" ? "bg-blue-500/15 text-blue-800 border border-blue-500/20" :
                        "bg-secondary text-muted-foreground border border-border"
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-medium mt-1">
                      <span>By: <strong className="text-foreground font-semibold">{b.borrower?.fullName || 'Borrower'}</strong></span>
                      <span>•</span>
                      <span>Pickup: <strong className="text-foreground font-semibold">{formatDateDisplay(b.startDate)}</strong></span>
                      <span>•</span>
                      <span>Return: <strong className="text-foreground font-semibold">{formatDateDisplay(b.endDate)}</strong></span>
                      <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                        {formatDurationDisplay(b.duration || calculateDurationDays(b.startDate, b.endDate))}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:items-end justify-between gap-4 w-full md:w-auto">
                    <div className="md:text-right flex items-center justify-between md:block w-full">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-1">Rental Earnings</p>
                      <p className="font-semibold text-xl text-foreground">{formatCurrency(b.rentalAmount || (b.product?.pricePerDay * (b.duration || 1)))}</p>
                    </div>
                    
                    {b.status === "PENDING" && (
                      <div className="flex gap-3 w-full md:w-auto justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "reject")}
                          className="rounded-xl border-border text-xs font-medium h-10 px-4 hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                        >
                          Decline
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "accept")}
                          className="rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-10 px-6 hover:bg-primary/90 shadow-md"
                        >
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
             <Button onClick={() => setShowCreateModal(true)} className="rounded-xl bg-primary text-primary-foreground h-12 px-6 hover:bg-primary/90 shadow-md">
              <Plus className="h-5 w-5 mr-2" /> List New Item
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-32 rounded-3xl border border-border bg-card">
              <p className="text-2xl font-medium mb-4 text-foreground">No products listed.</p>
              <p className="text-muted-foreground mb-8">Start earning by listing your first product.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div key={p._id} className="p-6 rounded-2xl border border-border bg-card shadow-xs flex flex-col hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${
                      p.status === 'ACTIVE' ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20' : 'bg-amber-500/15 text-amber-800 border border-amber-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xl mb-1 text-foreground">{p.name}</h4>
                  <p className="text-sm font-medium text-muted-foreground mb-6">{p.category?.name}</p>
                  
                  <div className="mt-auto pt-6 border-t border-border flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Price</p>
                      <p className="font-semibold text-xl text-foreground">₹{p.pricePerDay} <span className="text-xs text-muted-foreground">/ day</span></p>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setEditingProduct(p)}
                      className="rounded-xl border-border text-xs font-semibold h-9 px-4 hover:bg-secondary cursor-pointer"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
    <CreateProductModal open={showCreateModal} onClose={() => setShowCreateModal(false)} />
    <EditProductModal
      product={editingProduct}
      open={Boolean(editingProduct)}
      onClose={() => setEditingProduct(null)}
      onSuccess={() => {
        refetchProducts();
        refetchStats();
      }}
    />
    </>
  );
}
