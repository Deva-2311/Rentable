"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";
import { useProducts } from "@/features/products/api/useProducts";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";

export default function Home() {
  const router = useRouter();
  const { data } = useProducts({ limit: 4 });
  const products = data?.products || [];
  
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    // location and dates would be handled ideally via specific filters if API supported them, 
    // but we just pass search for now
    router.push(`/explore?${params.toString()}`);
  };
  return (
    <div className="flex flex-col min-h-screen bg-barca-navy text-white overflow-hidden relative">
      {/* HERO SECTION - IMMERSIVE POSTER LAYOUT */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Massive Background Handwritten Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <span className="font-rock-salt text-[25vw] md:text-[20vw] text-red-500/20 -rotate-12 select-none whitespace-nowrap">
            RENT
          </span>
        </div>

        {/* Floating Featured Subject */}
        {products.length > 0 ? (
          <div 
            className="relative z-10 w-[80vw] h-[60vh] md:w-[60vw] md:h-[70vh] cursor-pointer group"
            onClick={() => router.push(`/products/${products[0]._id}`)}
          >
            {/* The Image floating without borders */}
            {products[0].images?.[0] ? (
              <img 
                src={products[0].images[0]} 
                alt={products[0].name} 
                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-xs uppercase tracking-widest">
                [ No Image ]
              </div>
            )}
            
            {/* Details floating over the image */}
            <div className="absolute bottom-10 right-10 text-right opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-red-500 block mb-1">
                {products[0].category?.name || "Featured"}
              </span>
              <span className="text-2xl font-bold tracking-tight bg-black/50 backdrop-blur-sm px-4 py-2 rounded-sm inline-block">
                {products[0].name}
              </span>
            </div>
          </div>
        ) : (
          <div className="relative z-10 w-full h-[60vh] flex items-center justify-center">
            <span className="text-white/50 text-xs uppercase tracking-widest animate-pulse">[ Loading ]</span>
          </div>
        )}

        {/* Massive Bottom Anchor Text */}
        <div className="absolute bottom-0 w-full flex justify-center pb-8 z-20 pointer-events-none">
          <h1 className="font-anton text-[12vw] leading-none tracking-tight text-white/90 select-none uppercase">
            RENTABLE
          </h1>
        </div>
      </section>

      {/* NEW CURATED COLLECTION PREVIEW - YELLOW POSTER */}
      <section className="relative min-h-screen bg-dortmund-yellow text-black flex flex-col justify-center py-32 overflow-hidden z-20">
        
        {/* Background Accent Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
          <span className="font-rock-salt text-[20vw] text-black/10 -rotate-6 select-none whitespace-nowrap">
            OBJECTS
          </span>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6 px-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-black mb-4 flex items-center">
                <span className="w-8 h-0.5 bg-black mr-4"></span>
                The Collection
              </h2>
              <h3 className="text-5xl md:text-7xl font-anton tracking-tight uppercase">Find something</h3>
              <h3 className="text-5xl md:text-7xl font-anton tracking-tight uppercase text-black/50">worth using.</h3>
            </div>
            <Link href="/explore" className="text-xs font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center group bg-black text-white px-8 py-4 rounded-full">
              View All <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(1).map((product: Product) => (
              <Link key={product._id} href={`/products/${product._id}`} className="group cursor-pointer block relative">
                {/* Floating Product Presentation */}
                <div className="relative aspect-[4/5] overflow-hidden mb-6 flex items-center justify-center p-8 bg-black/5 backdrop-blur-sm rounded-3xl border border-black/10 group-hover:bg-black/10 transition-colors">
                  {product.images?.[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="w-full h-full object-contain drop-shadow-xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-700 ease-out" 
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-black/40">
                      [ No Image ]
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1 px-2">
                  <h4 className="font-bold text-xl leading-tight uppercase tracking-tight">{product.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-black/60">{product.location}</p>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-lg">₹{product.pricePerDay.toLocaleString()}</span>
                      <span className="text-[10px] text-black/60 font-bold uppercase tracking-widest ml-1">/ day</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
