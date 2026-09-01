"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAdminStats, useAdminUsers, useAdminProducts, useAdminBookings, useToggleUserStatus } from "@/features/admin/api/useAdmin";
import { User } from "@/types/user";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Package, Calendar, IndianRupee, Activity, ShieldAlert } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-500/20 text-purple-400",
  owner: "bg-blue-500/20 text-blue-400",
  borrower: "bg-green-500/20 text-green-400",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  ACTIVE: "bg-green-500/20 text-green-400 border-green-500/30",
  CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
  REJECTED: "bg-red-500/20 text-red-400 border-red-500/30",
  COMPLETED: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  ACTIVE_PRODUCT: "bg-green-500/20 text-green-400",
  PENDING_APPROVAL: "bg-yellow-500/20 text-yellow-400",
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
    if (user.role !== "admin") { router.push("/"); return; }
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
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">Platform control panel — real-time data</p>
        </div>
        <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1">
          Admin Access
        </Badge>
      </div>

      {/* STATS GRID */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-400" },
            { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-primary" },
            { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "text-yellow-400" },
            { label: "Active Rentals", value: stats.activeRentals, icon: Activity, color: "text-green-400" },
            { label: "Platform Revenue", value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: "text-emerald-400" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50 bg-card/60">
              <CardContent className="p-4 flex items-center gap-3">
                <stat.icon className={`h-7 w-7 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-1 mb-6 border-b border-border/50">
        {(["overview", "users", "products", "bookings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => loadTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "overview" && stats && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent Users</h2>
          {(stats.recentUsers || []).map((u: User) => (
            <Card key={u._id} className="border-border/50">
              <CardContent className="p-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                  {u.fullName?.charAt(0) || "?"}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{u.fullName}</p>
                  <p className="text-xs text-muted-foreground">{u.email}</p>
                </div>
                <Badge className={`text-xs ${ROLE_COLORS[u.role] || ""}`}>{u.role}</Badge>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {new Date(u.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {stats.pendingBookings > 0 && (
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <p className="text-yellow-400 font-medium">
                ⏳ {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? "s" : ""} waiting for owner approval
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-2">
          {usersLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading users...</div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No users found</div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">{users.length} total users</p>
              {users.map((u) => (
                <Card key={u._id} className="border-border/50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary shrink-0">
                      {u.fullName?.charAt(0) || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{u.fullName}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                    </div>
                    <Badge className={`text-xs shrink-0 ${ROLE_COLORS[u.role] || ""}`}>{u.role}</Badge>
                    <button 
                      onClick={() => handleToggleStatus(u._id, u.isActive)}
                      disabled={isToggling}
                      className="shrink-0"
                    >
                      <Badge variant={u.isActive ? "default" : "secondary"} className={`text-xs cursor-pointer ${u.isActive ? 'hover:bg-red-500/20 hover:text-red-500' : 'hover:bg-green-500/20 hover:text-green-500'}`}>
                        {u.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </button>
                    <p className="text-xs text-muted-foreground hidden md:block shrink-0">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* PRODUCTS */}
      {activeTab === "products" && (
        <div className="space-y-2">
          {productsLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading products...</div>
          ) : !products || products.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No products found</div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">{products.length} total products</p>
              {products.map((p) => (
                <Card key={p._id} className="border-border/50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.owner?.fullName} • {p.category?.name} • ₹{p.pricePerDay}/day
                      </p>
                    </div>
                    <Badge className={`text-xs shrink-0 ${STATUS_COLORS[p.status + "_PRODUCT"] || "bg-secondary/50 text-secondary-foreground"}`}>
                      {p.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}

      {/* BOOKINGS */}
      {activeTab === "bookings" && (
        <div className="space-y-2">
          {bookingsLoading ? (
            <div className="text-center py-16 text-muted-foreground">Loading bookings...</div>
          ) : !bookings || bookings.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No bookings found</div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-3">{bookings.length} total bookings</p>
              {bookings.map((b) => (
                <Card key={b._id} className="border-border/50">
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{b.product?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.borrower?.fullName} → {b.owner?.fullName}
                        <span className="mx-2">•</span>
                        {new Date(b.startDate).toLocaleDateString()} – {new Date(b.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={`text-xs shrink-0 border ${STATUS_COLORS[b.status] || ""}`}>{b.status}</Badge>
                    <p className="text-sm font-bold shrink-0">₹{b.totalAmount?.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
