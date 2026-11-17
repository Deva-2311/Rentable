"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, MapPin, Calendar, ArrowRight, Filter, ChevronDown, CheckCircle2 } from "lucide-react";
import { useProducts } from "@/features/products/api/useProducts";
import { useAuth } from "@/lib/auth/AuthContext";
import { categoriesService, wishlistService } from "@/utils/services";
import { toast } from "react-hot-toast";
import { ProductCard } from "@/components/marketplace/ProductCard";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

import { Product } from "@/types/product";



function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sort: searchParams.get("sort") || "newest",
    page: parseInt(searchParams.get("page") || "1"),
  });

  const { data: productsData, isLoading } = useProducts({
    ...filters,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  });
  const products = productsData?.products || [];
  const pagination = { 
    page: productsData?.page || 1, 
    totalPages: productsData?.pages || 1, 
    total: productsData?.total || products.length 
  };

  useEffect(() => {
    categoriesService.getAll()
      .then((res) => setCategories(res.data || []))
      .catch(() => {});
  }, []);

  const toggleWishlist = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push("/login"); return; }
    try {
      if (wishlist.has(productId)) {
        await wishlistService.remove(productId);
        setWishlist((prev) => { const s = new Set(prev); s.delete(productId); return s; });
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.add(productId);
        setWishlist((prev) => new Set(prev).add(productId));
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  const applyFilters = () => {
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", sort: "newest", page: 1 });
  };

  const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[4/3] bg-muted w-full mb-4 rounded-xl border border-border" />
      <div className="h-5 bg-muted w-3/4 mb-2 rounded" />
      <div className="h-4 bg-muted w-1/2 rounded" />
    </div>
  );

  return (
    <div className="bg-background min-h-screen">
      {/* Top Command Surface & Spatial Filter Console */}
      <section className="w-full px-4 md:px-8 max-w-[1440px] mx-auto pt-6 pb-4 border-b border-border">
        <div className="w-full bg-card rounded-lg border border-border p-3 md:p-4 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            
            {/* Search Parameter 01: Equipment Query */}
            <div className="lg:col-span-4 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm">
              <Search className="text-primary w-5 h-5" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Search</span>
                <input 
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none truncate" 
                  placeholder="What do you need to rent?" 
                  type="text" 
                  value={filters.search}
                  onChange={(e) => setFilters(f => ({...f, search: e.target.value}))}
                />
              </div>
            </div>
            
            {/* Search Parameter 02: Geolocation */}
            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm cursor-pointer hover:bg-secondary/80 transition-colors">
              <MapPin className="text-primary w-5 h-5" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Location</span>
                <span className="text-sm text-foreground font-medium truncate">San Francisco, CA</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Search Parameter 03: Date Window */}
            <div className="lg:col-span-3 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm cursor-pointer hover:bg-secondary/80 transition-colors">
              <Calendar className="text-primary w-5 h-5" />
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Dates</span>
                <span className="text-sm text-foreground font-medium truncate">This Weekend</span>
              </div>
              <Filter className="w-4 h-4 text-muted-foreground" />
            </div>
            
            {/* Search Execution CTA */}
            <div className="lg:col-span-2 flex">
              <button onClick={applyFilters} className="w-full py-3 rounded-sm bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs hover:bg-primary/90 transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Quick Curation Chips Strip */}
          <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
            <button 
              onClick={() => setFilters(f => ({...f, category: ""}))}
              className={`px-4 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${!filters.category ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-secondary text-foreground border-border'}`}
            >
              All Products
            </button>
            {categories.map(cat => (
              <button 
                key={cat._id}
                onClick={() => setFilters(f => ({...f, category: cat._id}))}
                className={`px-4 py-1.5 rounded-sm text-xs font-semibold whitespace-nowrap transition-colors border ${filters.category === cat._id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card hover:bg-secondary text-foreground border-border'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Exploration Matrix */}
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-8 py-4 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Filters */}
          <aside className="hidden lg:block lg:col-span-3 xl:col-span-3 sticky top-24 space-y-5">
            <div className="bg-card p-5 rounded-lg shadow-sm border border-border space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <Filter className="text-primary w-4 h-4" />
                  <h2 className="text-base font-semibold text-foreground">Filters</h2>
                </div>
                <button onClick={clearFilters} className="text-xs font-semibold text-primary hover:text-foreground transition-colors">
                  Reset
                </button>
              </div>

              {/* Price Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Price Range</h3>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                    <input 
                      type="number" 
                      value={filters.minPrice}
                      onChange={(e) => setFilters(f => ({...f, minPrice: e.target.value}))}
                      className="w-full pl-7 pr-3 py-2 bg-secondary border border-border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                      placeholder="Min"
                    />
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                    <input 
                      type="number" 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(f => ({...f, maxPrice: e.target.value}))}
                      className="w-full pl-7 pr-3 py-2 bg-secondary border border-border rounded-sm text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary" 
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Sort Strategy */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Sort By</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" checked={filters.sort === 'newest'} onChange={() => setFilters(f => ({...f, sort: 'newest'}))} className="accent-primary w-4 h-4" />
                    <span className="text-sm text-foreground">Chronological (Newest)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" checked={filters.sort === 'price_asc'} onChange={() => setFilters(f => ({...f, sort: 'price_asc'}))} className="accent-primary w-4 h-4" />
                    <span className="text-sm text-foreground">Price: Low to High</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" checked={filters.sort === 'price_desc'} onChange={() => setFilters(f => ({...f, sort: 'price_desc'}))} className="accent-primary w-4 h-4" />
                    <span className="text-sm text-foreground">Price: High to Low</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="sort" checked={filters.sort === 'rating'} onChange={() => setFilters(f => ({...f, sort: 'rating'}))} className="accent-primary w-4 h-4" />
                    <span className="text-sm text-foreground">Top Rated</span>
                  </label>
                </div>
              </div>
              
              <button onClick={applyFilters} className="w-full py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-sm text-xs font-semibold transition-colors">
                Apply Filters
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: Products Grid */}
          <section className="lg:col-span-9 xl:col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-semibold tracking-tight text-foreground">All Products</h1>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 py-1 bg-secondary rounded-sm border border-border">
                  {isLoading ? "Loading..." : `${pagination.total} Available`}
                </span>
                {/* Mobile Filter Toggle */}
                <button className="lg:hidden p-2 rounded-sm bg-secondary border border-border text-foreground">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="w-full flex flex-col items-center justify-center py-32 bg-card border border-border rounded-2xl text-center px-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
                  <Search className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-heading font-medium mb-2">No active assets found</h2>
                <p className="text-muted-foreground max-w-md mb-8">We couldn&apos;t locate any items matching your precise coordinates and filter requirements.</p>
                <button onClick={clearFilters} className="px-6 py-2.5 bg-background border border-border text-[11px] font-bold uppercase tracking-widest text-foreground hover:bg-muted transition-colors rounded-full shadow-sm">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    category={product.category?.name || "Other"}
                    pricePerDay={product.pricePerDay}
                    location={product.location}
                    rating={product.rating || 0}
                    reviewsCount={product.reviewCount || 0}
                    imageUrl={product.images?.[0] || ""}
                    isVerifiedOwner={product.owner?.isVerified || false}
                    isAvailable={product.availability === true}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
                <button 
                  disabled={filters.page <= 1}
                  onClick={() => setFilters(f => ({...f, page: f.page - 1}))}
                  className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-2">
                  <span className="text-sm font-medium text-foreground">
                    Page {filters.page} of {pagination.totalPages}
                  </span>
                </div>
                <button 
                  disabled={filters.page >= pagination.totalPages}
                  onClick={() => setFilters(f => ({...f, page: f.page + 1}))}
                  className="px-4 py-2 rounded-sm border border-border text-xs font-semibold text-foreground disabled:opacity-50 hover:bg-secondary transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-forest-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ExploreContent />
    </Suspense>
  );
}
