"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, Search, Calendar, Shield, Camera, Package, Zap } from "lucide-react";
import Image from "next/image";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { useProducts } from "@/features/products/api/useProducts";

// Mock Data for the page
const FEATURED_PRODUCTS = [
  {
    id: "1",
    title: "Sony Alpha 7 IV Cinema Package",
    dailyRate: 1250,
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=800&auto=format&fit=crop",
    category: "Cameras",
    rating: 4.9,
    reviews: 42,
    location: "Downtown SF",
    owner: { name: "Elena R.", avatar: "", isVerified: true },
  },
  {
    id: "2",
    title: "DJI Mavic 3 Pro Drone Kit",
    dailyRate: 950,
    imageUrl: "https://images.unsplash.com/photo-1506947411487-a56738267384?q=80&w=800&auto=format&fit=crop",
    category: "Drones",
    rating: 4.8,
    reviews: 18,
    location: "Oakland",
    owner: { name: "Marcus T.", avatar: "", isVerified: true },
  },
  {
    id: "3",
    title: "VanMoof S3 Commuter E-Bike",
    dailyRate: 650,
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=800&auto=format&fit=crop",
    category: "Mobility",
    rating: 5.0,
    reviews: 7,
    location: "Mission District",
    owner: { name: "Sarah K.", avatar: "", isVerified: true },
  },
  {
    id: "4",
    title: "Oculus Quest 3 VR Headset",
    dailyRate: 400,
    imageUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?q=80&w=800&auto=format&fit=crop",
    category: "Gaming",
    rating: 4.7,
    reviews: 24,
    location: "SOMA",
    owner: { name: "David L.", avatar: "", isVerified: false },
  }
];

export default function Home() {
  const router = useRouter();
  const { data } = useProducts({ limit: 4 });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/explore");
  };

  const displayProducts = data?.products?.length ? data.products : FEATURED_PRODUCTS;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── HERO SECTION ── */}
      <section className="w-full pt-32 pb-16 lg:pb-24 px-4 lg:px-14 border-b border-border">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-center text-foreground max-w-4xl tracking-[-0.02em] mb-6 leading-tight font-medium">
            Premium product rentals.
            <span className="block text-muted-foreground mt-2 font-normal">Discover, rent, and return.</span>
          </h1>
          
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-2xl mb-12">
            Access industrial grade tools, optics, and mobility assets. Verified owners, instant custody, and secure coverage.
          </p>

          {/* Structured Bento Search Bar */}
          <div className="w-full max-w-4xl bg-card border border-border p-2 rounded-lg shadow-sm mb-16">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <div className="md:col-span-4 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm">
                <Search className="text-primary w-5 h-5 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5" htmlFor="search-gear">Product</label>
                  <input className="bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground" id="search-gear" placeholder="Leica Q3, E-Bike..." type="text"/>
                </div>
              </div>

              <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm">
                <MapPin className="text-primary w-5 h-5 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5" htmlFor="search-location">Location</label>
                  <input className="bg-transparent text-foreground text-sm focus:outline-none truncate placeholder:text-muted-foreground" id="search-location" type="text" defaultValue="San Francisco, CA"/>
                </div>
              </div>

              <div className="md:col-span-3 flex items-center gap-3 px-4 py-3 bg-secondary rounded-sm">
                <Calendar className="text-primary w-5 h-5 shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <label className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase mb-0.5" htmlFor="search-dates">Dates</label>
                  <input className="bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground" id="search-dates" type="text" defaultValue="This Weekend"/>
                </div>
              </div>

              <div className="md:col-span-2 flex">
                <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold rounded-sm transition-colors" type="submit">
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Hero Editorial Image */}
          <div className="w-full max-w-5xl rounded-2xl overflow-hidden border border-border">
            <Image 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTamVRxGdiXTls_3FcbJyss6yJ1OYi9V1UXM38aOr8SSGmGOjr8Y7PiVUV-EAEwQb9ST2HGQWe2HPBjv_D1w-1HSZyEswntNV2b8k8hVTwAP16fpo16vBVR6uULUxC1BNgazAqLKwqyH-D8fOllh-Qyqx4haOQITZpUB8zkt_OiBG479N_-56HAevpHFFmINE-maZYVume9q6udUrtcpQIpQACsjtnRuJ95xXnw3ynHtuOTN30rG_8" 
              alt="Editorial studio gear collection" 
              width={1200}
              height={675}
              priority
              className="w-full h-auto aspect-[16/9] object-cover" 
            />
          </div>
        </div>
      </section>

      {/* QUICK VALUE PROP STRIP */}
      <section className="w-full bg-secondary py-12 px-4 lg:px-14 border-b border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Guaranteed Shield</span>
            <span className="text-xs text-muted-foreground">Up to ₹15K Coverage</span>
          </div>
          <div className="flex flex-col gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Verified Custody</span>
            <span className="text-xs text-muted-foreground">Biometric Handover</span>
          </div>
          <div className="flex flex-col gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Flexible Durations</span>
            <span className="text-xs text-muted-foreground">Hourly to Monthly</span>
          </div>
          <div className="flex flex-col gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Instant Escrow</span>
            <span className="text-xs text-muted-foreground">Automated Deposits</span>
          </div>
        </div>
      </section>

      {/* CURATED CATEGORIES SECTION */}
      <section className="w-full py-20 px-4 lg:px-14 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-foreground tracking-[-0.02em]">Curated Categories</h2>
              <p className="text-muted-foreground mt-2 text-base">Industrial grade tools and mobility assets.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center gap-2 text-xs font-semibold text-primary hover:text-foreground transition-colors">
              View All Categories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="bento-container">
            {/* Category 1 */}
            <Link href="/categories/cameras" className="bento-card relative group col-span-4 md:col-span-8 lg:col-span-6 h-[400px]">
              <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0i6K45cMfZlEI74vOZ8CajfC0Hfcul63t38G1a1L-jz4z4G8tWcecyf1Qh-bqSlkdp0Getw9biprWKBLY9pCWmZlAfHkpFVIATbMxwaQ3i_g17Gf7kej7AkDqq0XsdDmm9VFZgz8PKUWjjrZhcO4gW_4xxpY5RfSrUQs-O9nWHjvgbYV6D6VQUCgxK4A-DVa94RyRwHfG05LKjm88XtG2PICGgWYGmXBHHqUFW60rqJWvco0jQZr9" alt="Cameras and lenses category preview" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-6 left-6 bg-card px-4 py-3 rounded-md shadow-sm border border-border">
                <h3 className="text-lg font-heading font-medium text-foreground">Optics & Cinema</h3>
                <span className="text-xs text-muted-foreground mt-1 block">42 Assets</span>
              </div>
            </Link>

            {/* Category 2 */}
            <Link href="/categories/mobility" className="bento-card relative group col-span-4 md:col-span-4 lg:col-span-3 h-[400px]">
              <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuCakagCWH2BoDbF8MzYqA1utxhjWbQb3F0aaDOj_x1Tdkkl2NvRBpolspMTboPTL-qRjVkD2d3y3JoArdpWk_EG1zltlUJxsYma-B8vSgRCtBaA1EMRVFv0XczFTeMWP8-lK85N62YFbva9WXwOUYyocBBFz1tBCkoc1H9H-FD9DeYly_ZztFMmtigotS_B5tibmeQdyyokG-PQIyVW28HJi-VKuTdxcR9Gr3wfXXZWAyCnciUdpmDl" alt="Bicycles and commuter gear" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-6 left-6 bg-card px-4 py-3 rounded-md shadow-sm border border-border">
                <h3 className="text-lg font-heading font-medium text-foreground">Mobility</h3>
                <span className="text-xs text-muted-foreground mt-1 block">18 Assets</span>
              </div>
            </Link>
            
            {/* Category 3 */}
            <Link href="/categories/gaming" className="bento-card relative group col-span-4 md:col-span-4 lg:col-span-3 h-[400px]">
              <Image src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUlhJt05kBBskc1zYHJcgcEnTAGNd0-oERZkXUPkZj2rQ1jBCZb1BZzhlkPuGNDHVD62xfPNQlpzaFtt64dvebAT1BTH4CtmbEMIYQa__xA3cpnE-rwZ-4YeE7dsF7iLtFtTW2eTkI9QE7zHKNscohnKb_OSRyNXASXaoG8eovgolwgpBoT4ZMzcR4VtU42yK3DBz3-7ux9R50_tWvKn0RANIGLoPzpLtCaeFKwDOhvrwh_HGBgAqN" alt="Gaming and portable devices" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
              <div className="absolute bottom-6 left-6 bg-card px-4 py-3 rounded-md shadow-sm border border-border">
                <h3 className="text-lg font-heading font-medium text-foreground">Gaming</h3>
                <span className="text-xs text-muted-foreground mt-1 block">85 Assets</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED RENTALS */}
      <section className="w-full py-20 px-4 lg:px-14 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl md:text-3xl font-heading text-foreground tracking-[-0.02em]">Featured Products</h2>
              <p className="text-muted-foreground mt-2 text-base">High-velocity assets with perfect custodial records.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {displayProducts.map((product: any) => (
              <ProductCard 
                key={product.id || product._id}
                id={product.id || product._id}
                name={product.title || product.name}
                category={product.category?.name || product.category}
                pricePerDay={product.dailyRate || product.pricePerDay}
                location={product.location}
                rating={product.rating}
                reviewsCount={product.reviews || product.reviewCount}
                imageUrl={product.imageUrl || product.images?.[0]}
                isVerifiedOwner={product.owner?.isVerified}
                isAvailable={true}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/explore" className="inline-flex items-center justify-center h-10 px-6 rounded-sm bg-card border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors shadow-sm">
              Explore All Rentals
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
