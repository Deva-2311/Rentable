'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { X, Loader2 } from 'lucide-react';
import { useCreateProduct } from '@/features/products/api/useProducts';
import { useQueryClient } from '@tanstack/react-query';
import { ImageUploader } from '@/components/uploads/ImageUploader';
import apiClient from '@/lib/api/client';

interface CreateProductForm {
  name: string;
  description: string;
  category: string;
  pricePerDay: number;
  securityDeposit: number;
  condition: string;
  location: string;
  rentalRules?: string;
}

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Worn'];

const CATEGORIES = [
  { id: 'bikes', name: 'Bikes & Cycles' },
  { id: 'cameras', name: 'Cameras & Photography' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'gaming', name: 'Gaming Consoles' },
  { id: 'furniture', name: 'Furniture' },
  { id: 'tools', name: 'Tools & Equipment' },
  { id: 'sports', name: 'Sports Equipment' },
  { id: 'music', name: 'Musical Instruments' },
  { id: 'other', name: 'Other' },
];

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateProductModal({ open, onClose }: CreateProductModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string; slug?: string }[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const { mutateAsync: createProduct } = useCreateProduct();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setLoadingCategories(true);
      apiClient
        .get('/categories')
        .then((res) => {
          const list = res.data?.data || res.data || [];
          if (Array.isArray(list) && list.length > 0) {
            setCategories(list);
          }
        })
        .catch((err) => {
          console.error('Failed to load categories', err);
        })
        .finally(() => {
          setLoadingCategories(false);
        });
    }
  }, [open]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<CreateProductForm>();

  const onSubmit = async (data: CreateProductForm) => {
    try {
      await createProduct(
        {
          name: data.name,
          description: data.description,
          category: data.category as unknown as import('@/types/product').Category,
          condition: data.condition,
          location: data.location,
          rentalRules: data.rentalRules,
          pricePerDay: Number(data.pricePerDay),
          securityDeposit: Number(data.securityDeposit),
          images,
          availability: true,
        } as Partial<import('@/types/product').Product>
      );
      toast.success('Product listed successfully!');
      queryClient.invalidateQueries({ queryKey: ['owner', 'products'] });
      reset();
      setImages([]);
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to create listing');
    }
  };

  if (!open) return null;

  const inputClass =
    'w-full bg-card border border-border rounded-xl py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2';

  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="min-h-full flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-3xl bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-border relative overflow-hidden animate-in zoom-in-95">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 relative z-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">New Listing</p>
              <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-2">List Your Item</h2>
              <p className="text-sm text-muted-foreground">Fill out the details below to add your item to the marketplace.</p>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative z-10">
            {/* Images */}
            <div className="bg-secondary/30 p-6 md:p-8 rounded-2xl border border-border">
              <label className={labelClass}>Photos (Max 5)</label>
              <ImageUploader value={images} onChange={setImages} maxFiles={5} />
              <p className="text-xs text-muted-foreground mt-4">High-quality photos increase rental chances. First image is the cover.</p>
            </div>

            {/* Core Details */}
            <div className="space-y-6 bg-secondary/30 p-6 md:p-8 rounded-2xl border border-border">
              <div>
                <label className={labelClass}>Item Name *</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  placeholder="e.g. Canon EOS R50 Camera"
                  className={inputClass}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className={labelClass}>Description *</label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  placeholder="Describe your item, what's included, any accessories..."
                  className={`${inputClass} resize-none`}
                />
                {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={labelClass}>Category *</label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className={`${inputClass} cursor-pointer`}
                    disabled={loadingCategories && categories.length === 0}
                  >
                    <option value="">
                      {loadingCategories && categories.length === 0
                        ? 'Loading categories...'
                        : 'Select category...'}
                    </option>
                    {categories.length > 0
                      ? categories.map((c) => (
                          <option key={c._id} value={c._id}>
                            {c.name}
                          </option>
                        ))
                      : CATEGORIES.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Condition *</label>
                  <select
                    {...register('condition', { required: 'Condition is required' })}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">Select condition...</option>
                    {CONDITIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-6 bg-secondary/30 p-6 md:p-8 rounded-2xl border border-border">
              <p className={labelClass}>Pricing (₹)</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`${labelClass} text-muted-foreground`}>Daily Rate *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                    <input
                      type="number"
                      min={1}
                      {...register('pricePerDay', { required: 'Price is required', min: 1 })}
                      placeholder="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`${labelClass} text-muted-foreground`}>Security Deposit *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                    <input
                      type="number"
                      min={0}
                      {...register('securityDeposit', { required: 'Deposit is required', min: 0 })}
                      placeholder="0"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Rules */}
            <div className="space-y-6 bg-secondary/30 p-6 md:p-8 rounded-2xl border border-border">
              <div>
                <label className={labelClass}>Location *</label>
                <input
                  {...register('location', { required: 'Location is required' })}
                  placeholder="City, Area (e.g. Chennai, Adyar)"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Rental Rules (optional)</label>
                <textarea
                  {...register('rentalRules')}
                  rows={3}
                  placeholder="Any special rules or requirements for renters..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 flex justify-end gap-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors px-6 py-3 rounded-xl border border-border bg-secondary hover:bg-secondary/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider px-8 py-3 rounded-xl hover:bg-primary/90 shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
