'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { useUpdateProduct } from '@/features/products/api/useProducts';
import { ImageUploader } from '@/components/uploads/ImageUploader';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';
import { X, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface EditProductModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export function EditProductModal({
  product,
  open,
  onClose,
  onSuccess,
}: EditProductModalProps) {
  const updateProductMutation = useUpdateProduct();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    pricePerDay: 0,
    securityDeposit: 0,
    condition: 'EXCELLENT',
    location: '',
    availability: true,
    status: 'ACTIVE',
    images: [] as string[],
  });

  useEffect(() => {
    if (open) {
      setLoadingCategories(true);
      apiClient
        .get('/categories')
        .then((res) => {
          setCategories(res.data?.data || []);
        })
        .catch(() => {
          // ignore error
        })
        .finally(() => setLoadingCategories(false));
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      const catId =
        typeof product.category === 'object' && product.category?._id
          ? product.category._id
          : typeof product.category === 'string'
          ? product.category
          : '';

      setForm({
        name: product.name || '',
        description: product.description || '',
        categoryId: catId,
        pricePerDay: product.pricePerDay || 0,
        securityDeposit: product.securityDeposit || 0,
        condition: product.condition || 'EXCELLENT',
        location: product.location || '',
        availability: product.availability ?? true,
        status: product.status || 'ACTIVE',
        images: product.images || [],
      });
    }
  }, [product]);

  if (!open || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (form.pricePerDay <= 0) {
      toast.error('Price per day must be greater than 0');
      return;
    }

    try {
      await updateProductMutation.mutateAsync({
        id: product._id,
        payload: {
          name: form.name.trim(),
          description: form.description.trim(),
          category: form.categoryId || undefined,
          pricePerDay: Number(form.pricePerDay),
          securityDeposit: Number(form.securityDeposit),
          condition: form.condition,
          location: form.location.trim(),
          availability: form.availability,
          status: form.status,
          images: form.images,
        } as any,
      });

      toast.success('Product updated successfully');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-bold font-heading text-foreground">Edit Listing Details</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Update pricing, photos, status, and rules for this asset.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Images */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Product Images (Max 5)
            </label>
            <ImageUploader
              value={form.images}
              onChange={(urls) => setForm({ ...form, images: urls })}
              maxFiles={5}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Product Title *
              </label>
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Sony Alpha A7 IV Body"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Category
              </label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full p-3 rounded-md border border-input bg-background text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
              placeholder="Describe condition, what is included in the kit, accessories..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Daily Rate (₹) *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={form.pricePerDay || ''}
                onChange={(e) => setForm({ ...form, pricePerDay: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Security Deposit (₹)
              </label>
              <Input
                type="number"
                min="0"
                value={form.securityDeposit || ''}
                onChange={(e) => setForm({ ...form, securityDeposit: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Hardware Condition
              </label>
              <select
                value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="BRAND_NEW">Brand New</option>
                <option value="LIKE_NEW">Like New</option>
                <option value="EXCELLENT">Excellent</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Location / Hub
              </label>
              <Input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="e.g. Bangalore, Indiranagar"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Listing Status
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="ACTIVE">Active (Live in Catalog)</option>
                <option value="PAUSED">Paused (Temporarily Hidden)</option>
              </select>
            </div>

            <div className="space-y-2 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.availability}
                  onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary w-4 h-4"
                />
                <span className="text-xs font-semibold text-foreground">Available for instant booking</span>
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-border flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={updateProductMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateProductMutation.isPending}
              className="bg-primary text-primary-foreground font-semibold px-6"
            >
              {updateProductMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
