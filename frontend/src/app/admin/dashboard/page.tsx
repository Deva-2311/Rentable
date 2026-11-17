"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAdminStats, useAdminUsers, useAdminProducts, useAdminBookings, useToggleUserStatus } from "@/features/admin/api/useAdmin";
import { User } from "@/types/user";
import { toast } from "react-hot-toast";
import { Users, Package, Calendar, IndianRupee, Activity, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { BentoBlock } from "@/components/ui/bento-block";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/15 text-purple-800 border-purple-500/20",
  owner: "bg-blue-500/15 text-blue-800 border-blue-500/20",
  borrower: "bg-secondary text-foreground border-border",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-800 border-amber-500/20",
  CONFIRMED: "bg-blue-500/15 text-blue-800 border-blue-500/20",
  ACTIVE: "bg-emerald-500/15 text-emerald-800 border-emerald-500/20",
  CANCELLED: "bg-red-500/15 text-red-800 border-red-500/20",
  REJECTED: "bg-red-500/15 text-red-800 border-red-500/20",
  COMPLETED: "bg-secondary text-muted-foreground border-border",
  ACTIVE_PRODUCT: "bg-emerald-500/15 text-emerald-800 border-emerald-500/20",
  PENDING_APPROVAL: "bg-amber-500/15 text-amber-800 border-amber-500/20",
};

type Tab = "overview" | "users" | "products" | "bookings";

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  
  // Conditionally fetch based on active tab
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: products, isLoading: productsLoading } = useAdminProducts();
  const { data: bookings, isLoading: bookingsLoading } = useAdminBookings();
  const { mutateAsync: toggleUserStatus, isPending: isToggling } = useToggleUserStatus();

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    if (user.role !== "admin" && user.role !== "super_admin") { router.push("/"); return; }
  }, [user, router]);

  const isLoading = statsLoading;

  const loadTab = (tab: Tab) => {
    setActiveTab(tab);
  };
  
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus({ id: userId, action: currentStatus ? "suspend" : "activate" });
      toast.success(`User ${currentStatus ? "suspended" : "activated"} successfully`);
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  if (isLoading) return (
    <div className="container mx-auto px-4 py-24 md:py-32 max-w-6xl space-y-16 animate-pulse">
      <div className="h-12 w-64 bg-secondary rounded-2xl" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-secondary rounded-3xl" />)}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
              <ShieldAlert className="h-6 w-6 text-purple-700" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">Admin Command Center</h1>
          </div>
          <p className="text-muted-foreground font-normal text-lg">Platform control panel — real-time data</p>
        </div>
        <span className="px-4 py-2 rounded-xl bg-purple-500/15 text-purple-800 border border-purple-500/20 text-xs font-bold uppercase tracking-widest">
          Admin Access
        </span>
      </div>

      {/* STATS GRID */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-16">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-700", bg: "bg-blue-500/15" },
            { label: "Products", value: stats.totalProducts, icon: Package, color: "text-primary", bg: "bg-primary/15" },
            { label: "Bookings", value: stats.totalBookings, icon: Calendar, color: "text-amber-800", bg: "bg-amber-500/15" },
            { label: "Active Rentals", value: stats.activeRentals, icon: Activity, color: "text-emerald-800", bg: "bg-emerald-500/15" },
            { label: "Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "text-purple-700", bg: "bg-purple-500/15" },
          ].map((stat) => (
            <BentoBlock key={stat.label} size="small" className="p-6 bg-card border-border shadow-xs">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-4`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-3xl font-semibold text-foreground mb-1">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
            </BentoBlock>
          ))}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-6 md:gap-12 mb-12 border-b border-border">
        {(["overview", "users", "products", "bookings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => loadTab(tab)}
            className={`pb-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors border-b-2 -mb-px relative ${
              activeTab === tab 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && stats && (
        <div className="space-y-8">
          <div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Recent Users</h2>
            <div className="flex flex-col gap-4">
              {(stats.recentUsers || []).map((u: User) => (
                <div key={u._id} className="p-6 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-secondary text-primary border border-border flex items-center justify-center font-bold text-xl">
                    {u.fullName?.charAt(0) || "?"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-foreground">{u.fullName}</p>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${ROLE_COLORS[u.role] || ""}`}>
                    {u.role}
                  </span>
                  <p className="text-xs text-muted-foreground hidden sm:block font-medium">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          {stats.pendingBookings > 0 && (
            <div className="p-6 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-800" />
              </div>
              <p className="text-amber-900 font-medium text-lg">
                <span className="font-bold">{stats.pendingBookings}</span> booking{stats.pendingBookings !== 1 ? "s" : ""} waiting for owner approval
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-4">
          {usersLoading ? (
            <div className="text-center py-24 text-muted-foreground font-medium">Loading users...</div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground font-medium">No users found</div>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground mb-6">{users.length} total users</p>
              <div className="flex flex-col gap-4">
                {users.map((u: any) => (
                  <div key={u._id} className="p-6 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-secondary text-primary border border-border flex items-center justify-center font-bold text-xl shrink-0">
                      {u.fullName?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate text-foreground">{u.fullName}</p>
                      <p className="text-sm text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 ${ROLE_COLORS[u.role] || ""}`}>
                      {u.role}
                    </span>
                    <button 
                      onClick={() => handleToggleStatus(u._id, u.isActive)}
                      disabled={isToggling}
                      className="shrink-0"
                    >
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border cursor-pointer transition-colors ${
                        u.isActive 
                          ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/20 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/20' 
                          : 'bg-destructive/15 text-destructive border-destructive/20 hover:bg-emerald-500/15 hover:text-emerald-800 hover:border-emerald-500/20'
                      }`}>
                        {u.isActive ? "Active" : "Suspended"}
                      </span>
                    </button>
                    <p className="text-xs text-muted-foreground hidden md:block shrink-0 font-medium">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-4">
          {productsLoading ? (
            <div className="text-center py-24 text-muted-foreground font-medium">Loading products...</div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground font-medium">No products found</div>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground mb-6">{products.length} total products</p>
              <div className="flex flex-col gap-4">
                {products.map((p: any) => (
                  <div key={p._id} className="p-6 rounded-2xl bg-card border border-border shadow-xs flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate mb-1 text-foreground">{p.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {p.owner?.fullName} • {p.category?.name} • ₹{p.pricePerDay}/day
                      </p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 ${STATUS_COLORS[p.status + "_PRODUCT"] || "bg-secondary text-muted-foreground border-border"}`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookingsLoading ? (
            <div className="text-center py-24 text-muted-foreground font-medium">Loading bookings...</div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground font-medium">No bookings found</div>
          ) : (
            <>
              <p className="text-sm font-medium text-muted-foreground mb-6">{bookings.length} total bookings</p>
              <div className="flex flex-col gap-4">
                {bookings.map((b: any) => (
                  <div key={b._id} className="p-6 rounded-2xl bg-card border border-border shadow-xs flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate mb-1 text-foreground">{b.product?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.borrower?.fullName} → {b.owner?.fullName}
                        <span className="mx-3 text-border">•</span>
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border shrink-0 ${STATUS_COLORS[b.status] || "bg-secondary text-muted-foreground border-border"}`}>
                        {b.status}
                      </span>
                      <p className="text-xl font-semibold shrink-0 w-24 text-right text-foreground">₹{b.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
    </div>
  );
}
