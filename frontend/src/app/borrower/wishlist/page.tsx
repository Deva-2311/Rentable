'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star, MapPin } from 'lucide-react';

const WISHED_ITEMS = [
  { id: '1', name: 'DJI Mavic 3 Pro', category: 'Drones', price: 2500, location: 'Koramangala', rating: 4.8 },
  { id: '2', name: 'Trek Marlin 7 Bike', category: 'Bikes', price: 800, location: 'HSR Layout', rating: 4.9 },
  { id: '3', name: 'PlayStation 5', category: 'Gaming', price: 1000, location: 'Indiranagar', rating: 5.0 },
];

export default function WishlistPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Saved for later</p>
          <h1 className="text-3xl font-light">My Wishlist</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {WISHED_ITEMS.map((item) => (
          <div key={item.id} className="group border border-border bg-card overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-widest text-muted-foreground">
                [ Image ]
              </div>
              <button className="absolute top-4 right-4 p-2 bg-background/80 backdrop-blur-sm hover:bg-background transition-colors">
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </button>
            </div>
            
            <div className="p-5">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                {item.category}
              </div>
              <h3 className="font-medium text-lg leading-tight mb-2 truncate">
                {item.name}
              </h3>
              
              <div className="flex items-center gap-3 mb-4">
                <p className="text-xs text-muted-foreground flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {item.location}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3 fill-[#A9C5A0] text-[#A9C5A0]" />
                  {item.rating}
                </p>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div>
                  <span className="font-medium">₹{item.price.toLocaleString()}</span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">/ day</span>
                </div>
                <Link href={`/products/${item.id}`} className="text-[10px] uppercase tracking-widest font-bold text-foreground hover:text-[#647A67]">
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
