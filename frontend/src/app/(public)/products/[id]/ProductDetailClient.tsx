"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ChevronRight, Heart, Info, MapPin, ShieldCheck, Star, Package, CheckCircle2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { useProduct } from "@/features/products/api/useProducts";
import { useCreateBooking } from "@/features/bookings/api/useBookings";
import { useAuth } from "@/lib/auth/AuthContext";
import { wishlistService } from "@/utils/services";
import { Product } from "@/types/product";
import { calculateDurationDays, formatDateDisplay } from "@/lib/date-utils";

export default function ProductDetailClient() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const { data: apiProduct, isLoading } = useProduct(id);
  const product = apiProduct as Product | undefined;
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 3));
  const [inWishlist, setInWishlist] = useState(false);

  const duration = calculateDurationDays(startDate, endDate);

  const rentalAmount = product ? duration * product.pricePerDay : 0;
  const multiDayDiscount = duration >= 3 ? rentalAmount * 0.1 : 0;
  const escrowFee = 290;
  const subtotal = rentalAmount - multiDayDiscount + escrowFee;
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const images = product?.images?.length ? product.images : [
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop"
  ];

  const handleBook = async () => {
    if (!user) {
      toast.error("Please log in to rent this product");
      router.push("/login");
      return;
    }
    if (user.role !== "borrower" && user.role !== "admin") {
      toast.error("Only verified borrowers can rent items");
      return;
    }

    const formattedStart = format(startDate, "yyyy-MM-dd");
    const formattedEnd = format(endDate, "yyyy-MM-dd");
    router.push(`/checkout/${id}?start=${formattedStart}&end=${formattedEnd}`);
  };

  const toggleWishlist = async () => {
    if (!user) { router.push("/login"); return; }
    try {
      if (inWishlist) {
        await wishlistService.remove(id);
        setInWishlist(false);
        toast.success("Removed from wishlist");
      } else {
        await wishlistService.add(id);
        setInWishlist(true);
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen pt-20 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen pt-20 flex flex-col items-center justify-center bg-background">
        <h2 className="text-2xl font-heading font-medium">Product Not Found</h2>
        <p className="text-muted-foreground mt-2">The requested equipment could not be located.</p>
        <Link href="/explore" className="mt-6 text-primary font-semibold text-sm hover:underline">
          Return to Explore
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pt-16">
      
      {/* Breadcrumbs */}
      <section className="border-b border-border bg-card">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-3 text-sm">
          <nav className="flex items-center space-x-2 text-muted-foreground whitespace-nowrap font-medium">
            <Link href="/explore" className="hover:text-foreground">Catalog</Link>
            <span className="text-border">/</span>
            <Link href={`/categories/${product.category?.slug || 'other'}`} className="hover:text-foreground">
              {product.category?.name || "Equipment"}
            </Link>
            <span className="text-border">/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* Image Gallery */}
            <section className="space-y-3">
              <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-secondary border border-border group">
                <Image 
                  src={images[selectedImage]} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`border rounded-lg p-1 bg-card text-left transition-all ${selectedImage === idx ? 'border-primary ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                    >
                      <div className="w-full aspect-[4/3] rounded-sm overflow-hidden bg-secondary relative">
                        <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            {/* Product Title & Info */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="bg-secondary text-foreground px-2 py-1 rounded-sm border border-border">
                  {product.category?.name || "Category"}
                </span>
                <span className="text-muted-foreground">•</span>
                <div className="flex items-center text-primary">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 font-semibold text-foreground">{product.rating || "New"}</span>
                  <span className="ml-1 text-muted-foreground font-normal">({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-heading font-medium tracking-tight text-foreground">
                {product.name}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </section>

            {/* Specifications Bento */}
            <section className="space-y-4">
              <h2 className="text-lg font-heading font-medium text-foreground">Specifications</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {product.specifications ? (
                  product.specifications.map((spec: Record<string, any>, idx: number) => (
                    <div key={idx} className="bg-card border border-border p-4 rounded-lg shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground block">{spec.label}</span>
                      <span className="text-sm font-medium text-foreground block mt-1">{spec.value}</span>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground block">Condition</span>
                      <span className="text-sm font-medium text-foreground block mt-1 capitalize">{product.condition}</span>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground block">Location</span>
                      <span className="text-sm font-medium text-foreground block mt-1">{product.location}</span>
                    </div>
                    <div className="bg-card border border-border p-4 rounded-lg shadow-sm">
                      <span className="text-xs font-semibold text-muted-foreground block">Value</span>
                      <span className="text-sm font-medium text-foreground block mt-1">₹{product.replacementValue?.toLocaleString() || "N/A"}</span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* What's Included */}
            {product.whatsIncluded && product.whatsIncluded.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-heading font-medium text-foreground">What&apos;s Included</h2>
                  <span className="text-xs font-semibold px-2 py-1 bg-secondary border border-border rounded-sm">
                    {product.whatsIncluded.length} Items
                  </span>
                </div>
                <div className="bg-card border border-border rounded-lg p-5 divide-y divide-border shadow-sm">
                  {product.whatsIncluded.map((item: Record<string, any>, idx: number) => (
                    <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-sm bg-secondary border border-border text-foreground flex items-center justify-center font-semibold text-xs">
                          {item.count}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-muted-foreground text-xs">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT COLUMN: Booking Calculator */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            <div className="bg-card border border-border rounded-xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
              {/* Header */}
              <div className="flex items-baseline justify-between border-b border-border pb-5">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground">Daily Rate</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-3xl font-heading font-medium text-foreground">₹{product.pricePerDay.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">/ day</span>
                  </div>
                </div>
              </div>

              {/* Booking Inputs */}
              <div className="pt-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary border border-border rounded-lg p-3">
                    <label className="block text-xs font-semibold text-muted-foreground">Pickup</label>
                    <div className="mt-1 flex items-center text-sm font-medium text-foreground">
                      <input 
                        type="date"
                        min={format(new Date(), "yyyy-MM-dd")}
                        value={format(startDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            setStartDate(new Date(e.target.value + 'T00:00:00'));
                          }
                        }}
                        className="bg-transparent border-none outline-none text-foreground w-full cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="bg-secondary border border-border rounded-lg p-3">
                    <label className="block text-xs font-semibold text-muted-foreground">Return</label>
                    <div className="mt-1 flex items-center text-sm font-medium text-foreground">
                      <input 
                        type="date"
                        min={format(startDate, "yyyy-MM-dd")}
                        value={format(endDate, "yyyy-MM-dd")}
                        onChange={(e) => {
                          if (e.target.value) {
                            setEndDate(new Date(e.target.value + 'T00:00:00'));
                          }
                        }}
                        className="bg-transparent border-none outline-none text-foreground w-full cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-secondary border border-border rounded-lg p-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-muted-foreground text-xs">{product.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ledger breakdown */}
              <div className="mt-6 pt-5 border-t border-border space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between items-center">
                  <span>Base Rate ({duration} days × ₹{product.pricePerDay})</span>
                  <span className="text-foreground font-medium">₹{rentalAmount.toLocaleString()}</span>
                </div>
                {multiDayDiscount > 0 && (
                  <div className="flex justify-between items-center text-primary">
                    <span>Multi-day Discount (-10%)</span>
                    <span>-₹{multiDayDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span>Platform Fee</span>
                  <span className="text-foreground font-medium">₹{escrowFee}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Taxes</span>
                  <span className="text-foreground font-medium">₹{tax.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>

                <div className="p-4 mt-4 bg-secondary border border-border rounded-lg flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-sm text-foreground">Security Hold: ₹{product.securityDeposit.toLocaleString()}</span>
                    <p className="mt-0.5 text-xs text-muted-foreground">Pre-authorized hold placed upon pickup. Released post-return.</p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-border flex justify-between items-center">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-heading font-medium text-foreground">
                    ₹{total.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-6 space-y-3">
                <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-3.5 rounded-sm bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={toggleWishlist}
                  className="w-full py-3 rounded-sm bg-card border border-border hover:bg-secondary text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-primary text-primary' : ''}`} />
                  <span>Save to Wishlist</span>
                </button>
              </div>
            </div>

            {/* Owner Profile Card */}
            <section className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center gap-4">
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-secondary border border-border overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-foreground font-heading font-medium text-lg">
                    {product.owner?.fullName?.charAt(0) || "U"}
                  </div>
                </div>
                {product.owner?.isVerified && (
                  <span className="absolute -bottom-1 -right-1 bg-primary text-white p-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-medium text-sm truncate">{product.owner?.fullName || "User"}</h4>
                  {product.owner?.isVerified && (
                    <span className="text-[10px] font-semibold bg-secondary border border-border text-foreground px-2 py-0.5 rounded-sm">Verified Owner</span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <span>Trusted Member</span>
                </div>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
