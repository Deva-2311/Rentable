"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, MapPin, Star, Shield, ChevronLeft, Heart } from "lucide-react";
import { format } from "date-fns";
import { useProduct } from "@/features/products/api/useProducts";
import { useCreateBooking } from "@/features/bookings/api/useBookings";
import { useAuth } from "@/lib/auth/AuthContext";
import { wishlistService } from "@/utils/services";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  
  const { data: product, isLoading } = useProduct(id);
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const [selectedImage, setSelectedImage] = useState(0);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [inWishlist, setInWishlist] = useState(false);

  const duration =
    startDate && endDate
      ? Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
        )
      : 0;

  const rentalAmount = product ? duration * product.pricePerDay : 0;
  const platformFee = rentalAmount * 0.1;
  const total = product ? rentalAmount + product.securityDeposit + platformFee : 0;

  const handleBook = async () => {
    if (!user) {
      toast.error("Please log in to book this product");
      router.push("/login");
      return;
    }
    if (user.role !== "borrower") {
      toast.error("Only borrowers can create bookings");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    if (duration <= 0) {
      toast.error("End date must be after start date");
      return;
    }

    try {
      const formattedStart = format(startDate, "yyyy-MM-dd");
      const formattedEnd = format(endDate, "yyyy-MM-dd");
      await createBooking({ product: id, startDate: formattedStart, endDate: formattedEnd });
      toast.success("Booking request sent! Waiting for owner approval.");
      router.push("/borrower/dashboard");
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to create booking");
    }
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
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[4/5] w-full bg-muted animate-pulse border border-border" />
          <div className="space-y-6 pt-10">
            <div className="h-4 w-24 bg-muted animate-pulse" />
            <div className="h-10 w-3/4 bg-muted animate-pulse" />
            <div className="h-6 w-1/2 bg-muted animate-pulse" />
            <div className="h-32 w-full bg-muted animate-pulse mt-12" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-32 text-center border border-border mt-16 max-w-2xl bg-card">
        <h1 className="text-3xl font-light mb-6">Product Not Found</h1>
        <Button onClick={() => router.push("/explore")} variant="outline" className="rounded-sm uppercase tracking-widest text-xs h-10 px-6 border-border">
          <ChevronLeft className="mr-2 h-3 w-3" /> Back to Collection
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      <button
        onClick={() => router.back()}
        className="flex items-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground mb-10 transition-colors"
      >
        <ChevronLeft className="h-3 w-3 mr-1" /> Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        
        {/* ── Image Gallery (Left) ── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-[4/5] bg-card overflow-hidden border border-border group">
            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                [ No Image Available ]
              </div>
            )}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 z-10 text-muted-foreground hover:text-foreground transition-colors`}
            >
              <Heart className={`h-6 w-6 ${inWishlist ? "fill-foreground text-foreground" : ""}`} strokeWidth={1} />
            </button>
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`w-24 aspect-[4/5] border transition-colors shrink-0 overflow-hidden ${i === selectedImage ? "border-foreground" : "border-border hover:border-foreground/50"}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Product Info + Booking (Right) ── */}
        <div className="lg:col-span-5 flex flex-col pt-4 lg:pt-10">
          
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {product.category?.name || "Uncategorized"}
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${product.availability ? "text-primary" : "text-destructive"}`}>
                {product.availability ? "Available" : "Unavailable"}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-light tracking-tight leading-tight mb-6">{product.name}</h1>
            
            <p className="text-muted-foreground font-light leading-relaxed mb-8">
              {product.description}
            </p>
            
            <div className="flex items-end gap-2 mb-8 pb-8 border-b border-border">
              <span className="text-4xl font-medium">₹{product.pricePerDay.toLocaleString()}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground pb-1">/ day</span>
            </div>
          </div>

          <div className="space-y-4 mb-8 text-sm text-muted-foreground">
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="uppercase tracking-widest text-[10px]">Location</span>
              <span className="flex items-center gap-1 text-foreground"><MapPin className="h-3 w-3" /> {product.location}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/50">
              <span className="uppercase tracking-widest text-[10px]">Owner</span>
              <span className="text-foreground">{product.owner.fullName}</span>
            </div>
            {product.rating > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="uppercase tracking-widest text-[10px]">Rating</span>
                <span className="flex items-center gap-1 text-foreground">
                  <Star className="h-3 w-3 fill-foreground" />
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>
            )}
          </div>

          {/* ── Booking Form ── */}
          <div className="mt-4 border border-border p-6 bg-card">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
              <CalendarIcon className="h-3 w-3" /> Rental Dates
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">Start Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-none border-0 border-b border-border bg-transparent px-0 py-2 h-auto hover:bg-transparent hover:text-foreground",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2 block">End Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-none border-0 border-b border-border bg-transparent px-0 py-2 h-auto hover:bg-transparent hover:text-foreground",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => date <= (startDate || new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {duration > 0 && (
              <div className="space-y-4 text-sm mb-8 pt-6 border-t border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>₹{product.pricePerDay.toLocaleString()} × {duration} day{duration > 1 ? "s" : ""}</span>
                  <span className="text-foreground">₹{rentalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3 w-3" /> Security deposit
                  </span>
                  <span className="text-foreground">₹{product.securityDeposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Platform fee (10%)</span>
                  <span className="text-foreground">₹{platformFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-4 border-t border-border">
                  <span className="uppercase tracking-widest text-[10px] flex items-center">Estimated Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>
            )}

            <Button
              className="w-full h-12 rounded-sm bg-foreground text-background uppercase tracking-widest text-xs hover:bg-foreground/90 transition-colors"
              onClick={handleBook}
              disabled={isBooking || !product.availability}
            >
              {isBooking ? "Processing..." : product.availability ? "Request to Rent" : "Currently Unavailable"}
            </Button>
          </div>

          {product.rentalRules && (
            <div className="mt-12 pt-8 border-t border-border">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">Rental Rules</h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed">{product.rentalRules}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
