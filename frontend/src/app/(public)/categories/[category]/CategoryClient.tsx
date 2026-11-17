"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Filter, Search, ShieldCheck, ArrowUpDown, Sparkles, PlusCircle } from "lucide-react";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useProducts } from "@/features/products/api/useProducts";

interface CategoryClientProps {
  categorySlug?: string;
}

export function formatCategoryName(slug?: string | null): string {
  if (!slug || typeof slug !== "string") {
    return "Products";
  }
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const CATEGORY_META: Record<string, { image: string; tag: string; description: string }> = {
  cameras: {
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    tag: "Optics & Sensors",
    description: "Professional cinema & mirrorless bodies, cinema glass, lighting, and audio rigs. Calibrated and sensor-checked before handover.",
  },
  mobility: {
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?q=80&w=1200&auto=format&fit=crop",
    tag: "Urban Transit",
    description: "High-performance e-bikes, electric scooters, cargo haulers, and urban commute gear. Battery health verified before every trip.",
  },
  gaming: {
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1200&auto=format&fit=crop",
    tag: "Next-Gen Play",
    description: "PlayStation 5, Xbox Series X, VR headsets, racing wheels, and portable consoles tested and sanitized for instant gaming.",
  },
  audio: {
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1200&auto=format&fit=crop",
    tag: "Acoustic Gear",
    description: "Studio monitors, podcast mic arrays, PA speakers, wireless lavaliers, and DJ decks with crystal-clear fidelity.",
  },
  vehicles: {
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop",
    tag: "Motor Fleet",
    description: "Premium touring motorcycles, road-trip campers, and city cars maintained strictly to manufacturer specifications.",
  },
  tools: {
    image: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?q=80&w=1200&auto=format&fit=crop",
    tag: "Workshop Tools",
    description: "Heavy-duty power tools, tile saws, rotary hammers, pressure washers, and carpentry setups for home or commercial jobs.",
  },
  drones: {
    image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200&auto=format&fit=crop",
    tag: "Aerial Capture",
    description: "4K/8K gimbal camera drones, FPV racers, and enterprise surveying aerial equipment with safety accessories.",
  },
  outdoors: {
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=1200&auto=format&fit=crop",
    tag: "Expedition Gear",
    description: "All-weather tents, lightweight camp kitchens, kayaks, mountaineering backpacks, and portable power stations.",
  },
  fitness: {
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
    tag: "Athletic Conditioning",
    description: "Adjustable dumbbell sets, commercial rowing machines, massage recovery guns, and road bikes ready for training.",
  },
  party: {
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",
    tag: "Celebration Gear",
    description: "Laser projectors, fog machines, high-wattage sound systems, ambient lighting, and commercial photo booths.",
  },
  events: {
    image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?q=80&w=1200&auto=format&fit=crop",
    tag: "Stage & Production",
    description: "Conference AV rigs, stage lighting, live streaming switchers, and crowd management equipment.",
  },
};

export function CategoryClient({ categorySlug }: CategoryClientProps) {
  // Resilient route slug resolution (prop primary, useParams fallback)
  const params = useParams();
  const routeSlug = typeof params?.category === "string" ? params.category : "";
  const effectiveSlug = (categorySlug || routeSlug || "").toLowerCase().trim();

  // Safely formatted display name
  const categoryName = useMemo(() => formatCategoryName(effectiveSlug), [effectiveSlug]);

  // UI Filter and Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<string>("newest");
  const [conditionFilter, setConditionFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Category specific metadata with fallback
  const meta = CATEGORY_META[effectiveSlug] || {
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop",
    tag: "Curated Fleet",
    description: `Discover verified ${categoryName.toLowerCase()} equipment available for rent from trusted local lenders. Fully insured with escrow protection.`,
  };

  // API query preserving the raw category slug for backend matching
  const { data: productsData, isLoading, isError, refetch } = useProducts({
    category: effectiveSlug || undefined,
    sort: sortOrder,
    search: searchTerm.trim() || undefined,
    limit: 24,
  });

  const rawProducts = productsData?.products || [];

  // Client-side quick filter for condition if selected
  const filteredProducts = useMemo(() => {
    if (conditionFilter === "all") return rawProducts;
    return rawProducts.filter((product) => {
      const cond = (product.condition || "").toUpperCase();
      if (conditionFilter === "PRO") {
        return cond === "LIKE_NEW" || cond === "BRAND_NEW" || cond === "NEW";
      }
      if (conditionFilter === "CONSUMER") {
        return cond === "GOOD" || cond === "FAIR" || cond === "EXCELLENT";
      }
      return true;
    });
  }, [rawProducts, conditionFilter]);

  const totalCount = productsData?.total ?? rawProducts.length;

  return (
    <div className="bg-background min-h-screen pt-20">
      {/* BREADCRUMBS */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pt-6 pb-4">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            RENTABLE
          </Link>
          <span className="text-border">/</span>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <span className="text-border">/</span>
          <span className="text-foreground">{categoryName}</span>
        </nav>
      </section>

      {/* CATEGORY EDITORIAL HERO BENTO */}
      <section className="w-full px-4 md:px-8 max-w-7xl mx-auto pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Architectural Editorial Narrative */}
          <div className="lg:col-span-7 bg-card border border-border rounded-xl p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-primary font-bold">{meta.tag}</span>
                <span className="text-border">•</span>
                <span>Verified Peer Fleet</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-heading font-medium tracking-tight text-foreground">
                {categoryName}
              </h1>
              
              <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
                {meta.description}
              </p>

              {/* Quick Category Filters */}
              <div className="pt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setConditionFilter("all")}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    conditionFilter === "all"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <span>All</span>
                  <span className="opacity-90">{rawProducts.length}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConditionFilter("PRO")}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    conditionFilter === "PRO"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <span>Professional</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConditionFilter("CONSUMER")}
                  className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${
                    conditionFilter === "CONSUMER"
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  <span>Everyday</span>
                </button>
              </div>
            </div>

            {/* Verification Stats Bar */}
            <div className="relative z-10 pt-8 mt-6 grid grid-cols-3 gap-4 border-t border-border">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Listed Units</span>
                <div className="text-xl font-heading font-semibold text-foreground flex items-center gap-1">
                  {totalCount} <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quality Guarantee</span>
                <div className="text-xl font-heading font-semibold text-foreground">Verified</div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Damage Escrow</span>
                <div className="text-xl font-heading font-semibold text-foreground tnum">₹25,000</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Stage with Hero Image */}
          <div className="lg:col-span-5 relative rounded-xl overflow-hidden shadow-md group min-h-[380px] flex flex-col justify-between p-6">
            <div className="absolute inset-0 z-0">
              <Image 
                src={meta.image}
                alt={`${categoryName} showcase`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
            </div>

            {/* Floating Pills over Image */}
            <div className="relative z-10 flex justify-between items-start">
              <div className="bg-black/70 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white flex items-center gap-2 shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{totalCount > 0 ? `${totalCount} GEAR KITS READY` : 'READY FOR NEW LISTINGS'}</span>
              </div>
              <Link
                href="/owner/products/new"
                className="bg-white/90 hover:bg-white text-black px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> List Gear
              </Link>
            </div>

            {/* Bottom Content inside Image */}
            <div className="relative z-10 mt-auto">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-1">CUSTODY ASSURANCE</p>
              <h3 className="text-xl font-heading text-white font-medium">Insured Peer Network</h3>
              <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
                Every reservation includes verified identity verification, inspection checks, and escrow protection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section className="w-full px-4 md:px-8 max-w-[1440px] mx-auto py-4 mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-heading font-medium tracking-tight text-foreground">
              Available {categoryName} Assets
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Showing {filteredProducts.length} verified item{filteredProducts.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search within category */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search in ${categoryName}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-muted/60 border border-border rounded-lg outline-none focus:border-foreground/40 transition-colors w-44 md:w-56"
              />
            </div>

            {/* Sort selector */}
            <div className="flex items-center gap-2 bg-muted/60 border border-border rounded-lg px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                aria-label="Sort products"
                className="bg-transparent border-none text-[11px] font-bold uppercase tracking-widest outline-none cursor-pointer text-foreground"
              >
                <option value="newest" className="bg-background text-foreground">Newest First</option>
                <option value="price_asc" className="bg-background text-foreground">Price: Low to High</option>
                <option value="price_desc" className="bg-background text-foreground">Price: High to Low</option>
                <option value="rating" className="bg-background text-foreground">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="border border-border rounded-xl p-4 space-y-4 animate-pulse bg-card">
                <div className="aspect-[4/3] bg-muted rounded-lg" />
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
                <div className="pt-2 flex justify-between">
                  <div className="h-5 bg-muted rounded w-1/3" />
                  <div className="h-5 bg-muted rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="col-span-full py-16 text-center border border-border rounded-xl bg-card p-8">
            <p className="text-sm text-destructive font-medium mb-3">
              Unable to load items for {categoryName}.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-4 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredProducts.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-border rounded-2xl bg-card/50 p-8 max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-medium text-foreground">
                No equipment currently listed in {categoryName}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
                {searchTerm
                  ? `No items matched "${searchTerm}". Try resetting your search terms or filters.`
                  : `Be the pioneer lender to list high-demand ${categoryName.toLowerCase()} equipment in your city, or explore our active gear categories.`}
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Clear Search
                </button>
              )}
              <Link
                href="/categories"
                className="px-4 py-2 border border-border rounded-lg text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                Browse All Categories
              </Link>
              <Link
                href="/owner/products/new"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold shadow-xs hover:opacity-95 transition-opacity"
              >
                List Your {categoryName} Equipment
              </Link>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const categoryDisplay =
                typeof product.category === "object" && product.category?.name
                  ? product.category.name
                  : categoryName;

              return (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  category={categoryDisplay}
                  pricePerDay={product.pricePerDay}
                  location={product.location}
                  rating={product.rating}
                  reviewsCount={product.reviewCount}
                  imageUrl={
                    product.images?.[0] ||
                    meta.image ||
                    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
                  }
                  isVerifiedOwner={true}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

