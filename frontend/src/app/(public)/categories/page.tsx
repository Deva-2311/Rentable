"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Bike, Camera, Laptop, Gamepad2, Wrench, Dumbbell, Sofa, Music, Package } from "lucide-react";
import { categoriesService } from "@/utils/services";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback icons mapping based on category names
const getIconForCategory = (name: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes("bike") || lowerName.includes("vehicle")) return Bike;
  if (lowerName.includes("camera") || lowerName.includes("photo")) return Camera;
  if (lowerName.includes("electronic") || lowerName.includes("laptop") || lowerName.includes("computer")) return Laptop;
  if (lowerName.includes("gam")) return Gamepad2;
  if (lowerName.includes("tool") || lowerName.includes("hardware")) return Wrench;
  if (lowerName.includes("sport") || lowerName.includes("fitness")) return Dumbbell;
  if (lowerName.includes("furniture") || lowerName.includes("event")) return Sofa;
  if (lowerName.includes("music") || lowerName.includes("audio")) return Music;
  return Package;
};

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  // productCount is not returned by the API by default, but we can display a generic or omit it.
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    categoriesService.getAll()
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to fetch categories", err))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">All Categories</h1>
        <p className="text-xl text-muted-foreground">
          Browse our extensive collection of items available for rent from people in your neighborhood.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No categories found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = getIconForCategory(category.name);
            return (
              <Link key={category._id} href={`/explore?category=${category._id}`}>
                <Card className="hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer h-full border-border/50 bg-card/50">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                      <Icon size={36} />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{category.description}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
