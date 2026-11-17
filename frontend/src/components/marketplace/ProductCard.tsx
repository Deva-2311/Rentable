import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin, Star, ShieldCheck } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  location: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  isVerifiedOwner: boolean;
  isAvailable?: boolean;
}

export function ProductCard({
  id,
  name,
  category,
  pricePerDay,
  location,
  rating,
  reviewsCount,
  imageUrl,
  isVerifiedOwner,
  isAvailable = true,
}: ProductCardProps) {
  return (
    <Link 
      href={`/products/${id}`}
      className="product-card group block transition-all duration-300 hover:border-primary/30"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground bg-secondary">
            No Image
          </div>
        )}

        {/* OVERLAYS */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button 
            className="w-8 h-8 rounded-sm bg-card/90 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-sm"
            onClick={(e) => {
              e.preventDefault();
              // Add to wishlist logic
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {isVerifiedOwner && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-card/90 backdrop-blur-sm px-2 py-1 rounded-sm border border-border flex items-center gap-1.5 text-[10px] font-semibold text-foreground">
              <ShieldCheck className="w-3 h-3 text-primary" />
              Verified
            </div>
          </div>
        )}
        
        {!isAvailable && (
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-destructive text-destructive-foreground px-2 py-1 rounded-sm text-[10px] font-semibold">
              Rented Out
            </div>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-1">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            {category}
          </span>
          {rating > 0 && (
            <div className="flex items-center gap-1 text-[11px] font-medium text-foreground">
              <Star className="w-3 h-3 fill-primary text-primary" />
              {rating.toFixed(1)} <span className="text-muted-foreground">({reviewsCount})</span>
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-1 group-hover:text-primary transition-colors">
          {name}
        </h3>

        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <MapPin className="w-3 h-3 mr-1 opacity-70" />
          <span className="truncate">{location}</span>
        </div>

        <div className="mt-3 pt-3 border-t border-border flex justify-between items-end">
          <div>
            <span className="text-base font-semibold text-foreground">₹{pricePerDay.toLocaleString()}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">/ day</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
