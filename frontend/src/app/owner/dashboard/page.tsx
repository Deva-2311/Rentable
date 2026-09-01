"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useOwnerStats, useOwnerBookings, useOwnerProducts } from "@/features/owner/api/useOwner";
import { useUpdateBookingStatus } from "@/features/bookings/api/useBookings";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-yellow-500",
  CONFIRMED: "text-blue-500",
  ACTIVE: "text-green-500",
  CANCELLED: "text-muted-foreground line-through",
  REJECTED: "text-red-500 line-through",
  COMPLETED: "text-muted-foreground",
};

export default function OwnerDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const { data: stats, isLoading: statsLoading } = useOwnerStats();
  const { data: bookingsData, isLoading: bookingsLoading } = useOwnerBookings();
  const { data: productsData, isLoading: productsLoading } = useOwnerProducts();
  const { mutateAsync: updateBooking } = useUpdateBookingStatus();

  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "products">("overview");

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "owner") { router.push("/"); return; }
  }, [user, router]);

  const bookings = bookingsData || [];
  const products = productsData || [];
  const isLoading = statsLoading || bookingsLoading || productsLoading;

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

  if (isLoading) return (
    <div className="container mx-auto px-4 py-16 max-w-5xl space-y-16 animate-pulse">
      <div className="h-10 w-64 bg-muted" />
      <div className="h-32 w-full bg-muted border border-border" />
      <div className="space-y-4">
        {[1,2,3,4].map(i => <div key={i} className="h-16 w-full border-b border-border bg-muted/20" />)}
      </div>
    </div>
  );

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl min-h-screen">
      <div className="mb-20 pb-8 border-b border-border flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight mb-2">Owner Dashboard.</h1>
          <p className="text-muted-foreground font-light">Manage your listings, earnings, and requests.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-sm sm:items-end">
          {stats && (
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Earnings</p>
                <p className="text-2xl font-medium text-foreground">₹{(stats.totalEarnings || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Active</p>
                <p className="text-2xl font-medium text-foreground">{stats.activeRentals}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Pending</p>
                <p className="text-2xl font-medium text-foreground">{stats.pendingRequests}</p>
              </div>
            </div>
          )}
          <Button onClick={() => toast("📦 Product creation form coming soon!")} className="rounded-none bg-foreground text-background uppercase tracking-widest text-xs h-10 px-6">
            <Plus className="h-4 w-4 mr-2" /> List Item
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-6 md:gap-12 mb-12 border-b border-border">
        {(["overview", "requests", "products"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px relative ${activeTab === tab ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
            {tab === "requests" && pendingBookings.length > 0 && (
              <span className="absolute -top-1 -right-4 text-[10px] text-yellow-500 font-bold">
                {pendingBookings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-12">
          {pendingBookings.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Action Required</h2>
              <div className="flex flex-col border border-border bg-card">
                {pendingBookings.slice(0, 3).map((b, index) => (
                  <div key={b._id} className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-colors ${index !== Math.min(pendingBookings.length, 3) - 1 ? 'border-b border-border/50' : ''}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-lg">{b.product?.name}</h4>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-yellow-500">PENDING</span>
                      </div>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
                        {b.borrower?.fullName} • {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between md:h-full gap-4 w-full md:w-auto">
                      <div className="md:text-right">
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Earnings</p>
                        <p className="font-medium text-lg">₹{(b.totalAmount ? b.totalAmount * 0.9 : 0).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "reject")}
                          className="rounded-none border-border text-xs uppercase tracking-widest h-8 hover:text-red-500 hover:border-red-500/50"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "accept")}
                          className="rounded-none bg-foreground text-background text-xs uppercase tracking-widest h-8 hover:bg-foreground/90"
                        >
                          Accept
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {pendingBookings.length > 3 && (
                <button onClick={() => setActiveTab("requests")} className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground mt-4 transition-colors">
                  View {pendingBookings.length - 3} more pending requests →
                </button>
              )}
            </div>
          )}

          <div>
             <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Recent Products</h2>
             {products.length === 0 ? (
                <div className="text-center py-20 border border-border bg-card">
                  <p className="text-xl font-light mb-2">No products yet.</p>
                  <p className="text-sm text-muted-foreground mb-6">List your first item to start earning.</p>
                  <Button onClick={() => toast("📦 Product creation coming soon!")} className="rounded-none bg-foreground text-background uppercase tracking-widest text-[10px] h-10 px-6">
                    List Item
                  </Button>
                </div>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.slice(0, 3).map((p) => (
                    <div key={p._id} className="border border-border p-6 bg-card hover:bg-muted/10 transition-colors">
                      <h4 className="font-medium text-lg mb-1">{p.name}</h4>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-4">{p.category?.name}</p>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Price</p>
                          <p className="font-medium">₹{p.pricePerDay} <span className="text-[10px] text-muted-foreground uppercase tracking-widest">/ day</span></p>
                        </div>
                        <span className={`text-[10px] uppercase tracking-widest font-bold ${p.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
      )}

      {/* REQUESTS TAB */}
      {activeTab === "requests" && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-32 border border-border bg-card">
              <p className="text-2xl font-light mb-4">No requests yet.</p>
              <p className="text-muted-foreground">When someone wants to rent your items, it will appear here.</p>
            </div>
          ) : (
            <div className="flex flex-col border border-border bg-card">
              {bookings.map((b, index) => (
                <div key={b._id} className={`p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-muted/10 transition-colors ${index !== bookings.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-medium text-lg">{b.product?.name}</h4>
                      <span className={`text-[10px] uppercase tracking-widest font-bold ${STATUS_COLORS[b.status] || "text-foreground"}`}>
                        {b.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mt-2">
                      By {b.borrower?.fullName} • {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()} ({b.duration} days)
                    </p>
                  </div>
                  
                  <div className="flex flex-col md:items-end justify-between md:h-full gap-4 w-full md:w-auto">
                    <div className="md:text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Earnings</p>
                      <p className="font-medium text-lg">₹{(b.totalAmount ? b.totalAmount * 0.9 : 0).toLocaleString()}</p>
                    </div>
                    
                    {b.status === "PENDING" && (
                      <div className="flex gap-2 w-full md:w-auto justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "reject")}
                          className="rounded-none border-border text-xs uppercase tracking-widest h-8 hover:text-red-500 hover:border-red-500/50"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          disabled={actionId === b._id}
                          onClick={() => handleAction(b._id, "accept")}
                          className="rounded-none bg-foreground text-background text-xs uppercase tracking-widest h-8 hover:bg-foreground/90"
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

      {/* PRODUCTS TAB */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex justify-end mb-4">
             <Button onClick={() => toast("📦 Product creation coming soon!")} className="rounded-none bg-foreground text-background uppercase tracking-widest text-[10px] h-10 px-6">
              <Plus className="h-4 w-4 mr-2" /> List Item
            </Button>
          </div>
          {products.length === 0 ? (
            <div className="text-center py-32 border border-border bg-card">
              <p className="text-2xl font-light mb-4">No products listed.</p>
              <p className="text-muted-foreground mb-8">Start earning by listing your first product.</p>
            </div>
          ) : (
            <div className="flex flex-col border border-border bg-card">
              {products.map((p, index) => (
                <div key={p._id} className={`p-6 flex justify-between items-center hover:bg-muted/10 transition-colors ${index !== products.length - 1 ? 'border-b border-border/50' : ''}`}>
                  <div>
                    <h4 className="font-medium text-lg mb-1">{p.name}</h4>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">
                      {p.category?.name} • ₹{p.pricePerDay}/day
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:inline-block ${p.status === 'ACTIVE' ? 'text-green-500' : 'text-yellow-500'}`}>
                      {p.status}
                    </span>
                    <Button size="sm" variant="outline" className="rounded-none border-border text-[10px] uppercase tracking-widest h-8 px-4">
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
  );
}
