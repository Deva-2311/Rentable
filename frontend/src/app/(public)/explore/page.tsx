"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X, MapPin } from "lucide-react";
import { useProducts } from "@/features/products/api/useProducts";
import { useAuth } from "@/lib/auth/AuthContext";
import { categoriesService, wishlistService } from "@/utils/services";
import { toast } from "react-hot-toast";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

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
    total: productsData?.total || 0 
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

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((f) => ({ ...f, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ search: "", category: "", minPrice: "", maxPrice: "", sort: "newest", page: 1 });
  };

  const ProductSkeleton = () => (
    <div className="flex flex-col animate-pulse">
      <div className="aspect-[4/5] bg-muted w-full mb-4 border border-border" />
      <div className="h-5 bg-muted w-3/4 mb-2" />
      <div className="h-4 bg-muted w-1/2" />
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {/* HEADER */}
      <div className="mb-16 border-b border-border pb-12 flex flex-col md:flex-row justify-between items-end gap-8">
        <div>
          <h1 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">The Collection</h1>
          <p className="text-4xl md:text-5xl font-light">Find something worth using.</p>
        </div>
        <form onSubmit={applyFilters} className="w-full md:w-auto relative border-b border-border flex items-center group focus-within:border-foreground transition-colors">
          <Search className="h-4 w-4 text-muted-foreground absolute left-0" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
            placeholder="Search items..."
            className="w-full md:w-64 pl-8 pr-4 py-2 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"
          />
        </form>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* FILTERS SIDEBAR */}
        <aside className="w-full lg:w-64 shrink-0 space-y-10">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Categories</h3>
              {(filters.category || filters.minPrice || filters.maxPrice) && (
                <button onClick={clearFilters} className="text-[10px] uppercase tracking-widest hover:text-foreground transition-colors flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear
                </button>
              )}
            </div>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 text-sm cursor-pointer group">
                <div className={`w-3 h-3 border border-border flex items-center justify-center transition-colors ${!filters.category ? 'bg-foreground border-foreground' : 'group-hover:border-foreground'}`} />
                <input
                  type="radio"
                  name="category"
                  checked={!filters.category}
                  onChange={() => setFilters((f) => ({ ...f, category: "", page: 1 }))}
                  className="hidden"
                />
                <span className={!filters.category ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>All Items</span>
              </label>
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center space-x-3 text-sm cursor-pointer group">
                  <div className={`w-3 h-3 border border-border flex items-center justify-center transition-colors ${filters.category === cat._id ? 'bg-foreground border-foreground' : 'group-hover:border-foreground'}`} />
                  <input
                    type="radio"
                    name="category"
                    checked={filters.category === cat._id}
                    onChange={() => setFilters((f) => ({ ...f, category: cat._id, page: 1 }))}
                    className="hidden"
                  />
                  <span className={filters.category === cat._id ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground transition-colors'}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Price Range (₹/day)</h3>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters((f) => ({ ...f, minPrice: e.target.value }))}
                className="h-10 rounded-none bg-transparent"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
                className="h-10 rounded-none bg-transparent"
              />
            </div>
          </div>

          <Button onClick={(e) => applyFilters(e as unknown as React.FormEvent)} className="w-full rounded-sm bg-foreground text-background uppercase tracking-widest text-xs h-12">
            Apply Filters
          </Button>
        </aside>

        {/* RESULTS GRID */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-10 pb-4 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">
              {isLoading ? "Loading..." : `${pagination.total} results`}
            </p>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value, page: 1 }))}
              className="text-xs uppercase tracking-widest bg-transparent border-none text-foreground outline-none cursor-pointer text-right focus:ring-0"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-32 border border-border bg-card">
              <p className="text-2xl font-light mb-4">Nothing here yet.</p>
              <p className="text-muted-foreground mb-8 max-w-sm mx-auto">Try widening your search terms or exploring another category to find what you need.</p>
              <Button onClick={clearFilters} variant="outline" className="rounded-sm uppercase tracking-widest text-xs h-10 px-6 border-border">Clear Filters</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
              {products.map((product) => (
                <Link key={product._id} href={`/products/${product._id}`} className="group cursor-pointer">
                  <div className="relative aspect-[4/5] bg-card overflow-hidden mb-5 border border-border">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground group-hover:scale-105 transition-transform duration-700 ease-out">
                        [ No Image ]
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleWishlist(product._id, e)}
                      className="absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Heart className={`h-5 w-5 ${wishlist.has(product._id) ? "fill-foreground text-foreground" : ""}`} strokeWidth={1} />
                    </button>
                    {product.category && (
                      <div className="absolute bottom-0 left-0 bg-background/90 backdrop-blur-sm px-3 py-1 text-[10px] uppercase tracking-widest text-foreground border-t border-r border-border">
                        {product.category.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-medium text-lg leading-tight mb-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center mt-2">
                        <MapPin className="h-3 w-3 mr-1 shrink-0" />
                        <span className="line-clamp-1 uppercase tracking-wider">{product.location}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-medium text-lg">₹{product.pricePerDay.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground block uppercase tracking-wider mt-1">/ day</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center mt-20 pt-8 border-t border-border">
              <Button
                variant="outline"
                className="rounded-sm border-border text-xs uppercase tracking-widest px-6"
                disabled={filters.page <= 1}
                onClick={() => setFilters((f) => ({ ...f, page: f.page - 1 }))}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground uppercase tracking-widest">
                Page {filters.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                className="rounded-sm border-border text-xs uppercase tracking-widest px-6"
                disabled={filters.page >= pagination.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: f.page + 1 }))}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="h-8 w-48 bg-muted rounded-none animate-pulse mb-16" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col animate-pulse">
                <div className="aspect-[4/5] bg-muted w-full mb-4 border border-border" />
                <div className="h-5 bg-muted w-3/4 mb-2" />
                <div className="h-4 bg-muted w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
