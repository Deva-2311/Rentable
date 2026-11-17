'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import apiClient from '@/lib/api/client';

const STEPS = ['Basic Info', 'Photos', 'Pricing', 'Availability & Rules', 'Publish'];

const productSchema = z.object({
  name: z.string().min(5, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description is required'),
  pricePerDay: z.any().transform(v => Number(v)),
  securityDeposit: z.any().transform(v => Number(v)),
  condition: z.string().min(1, 'Condition is required'),
  location: z.string().min(1, 'Location is required'),
  availability: z.boolean(),
  rentalRules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
});

type ProductFormValues = any;

export default function NewProductWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<{ _id: string, name: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors }, trigger } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      availability: true,
      condition: 'good',
    }
  });

  useEffect(() => {
    // Fetch categories on mount
    apiClient.get('/categories').then(res => {
      setCategories(res.data?.data || []);
    }).catch(err => {
      console.error('Failed to load categories', err);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files).slice(0, 5));
    }
  };

  const nextStep = async () => {
    // Validate current step before proceeding
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ['name', 'category', 'description'];
    if (currentStep === 2) fieldsToValidate = ['pricePerDay', 'securityDeposit'];
    if (currentStep === 3) fieldsToValidate = ['condition', 'location', 'rentalRules', 'cancellationPolicy'];

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const onSubmit = async (data: ProductFormValues) => {
    setIsUploading(true);
    let imageUrls: string[] = [];

    try {
      // 1. Upload images if any
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('files', file));
        
        const uploadRes = await apiClient.post('/uploads/images', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrls = uploadRes.data.data;
      } else {
        // Fallback dummy images if none uploaded (for MVP)
        imageUrls = [
          'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800',
        ];
      }

      // 2. Create product
      const payload = {
        ...data,
        images: imageUrls,
      };

      await apiClient.post('/products', payload);
      toast.success('Listing created successfully!');
      router.push('/owner/dashboard');

    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to create listing');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">New Listing</p>
        <h1 className="text-3xl font-light">Add a Product</h1>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-px bg-border -z-10" />
        {STEPS.map((step, idx) => (
          <div key={idx} className="flex flex-col items-center bg-background px-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
              idx === currentStep ? 'bg-primary text-primary-foreground border-2 border-background ring-2 ring-primary' :
              idx < currentStep ? 'bg-emerald-600 text-white' : 'bg-muted text-muted-foreground'
            }`}>
              {idx < currentStep ? <CheckCircle className="w-3 h-3" /> : idx + 1}
            </div>
            <div className={`text-[10px] uppercase tracking-widest mt-2 hidden sm:block ${idx <= currentStep ? 'font-bold text-foreground' : 'text-muted-foreground'}`}>
              {step}
            </div>
          </div>
        ))}
      </div>

      {/* Step Content Form */}
      <div className="bg-card border border-border p-8 md:p-12 rounded-2xl shadow-xs">
        <form id="productForm" onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-medium mb-6">Basic Information</h2>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Product Name</label>
                <input {...register('name')} type="text" placeholder="e.g. Sony A7 IV Camera Body Only" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none rounded-xl text-foreground" />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Category</label>
                <select {...register('category')} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none appearance-none rounded-xl text-foreground">
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                  <option value="60d5ecb74d6bb830b8e70f61">Temporary Mock Category</option>
                </select>
                {errors.category && <span className="text-red-500 text-xs">{errors.category.message as string}</span>}
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Description</label>
                <textarea {...register('description')} rows={5} placeholder="Describe the product, its condition, and what's included..." className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none resize-none rounded-xl text-foreground" />
                {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-medium mb-6">Photos</h2>
              <div className="border-2 border-dashed border-border rounded-2xl bg-background p-12 text-center hover:bg-muted/20 transition-colors cursor-pointer group relative">
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <UploadCloud className="w-10 h-10 mx-auto text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
                <p className="text-sm font-medium mb-1 text-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 10MB (Max 5)</p>
                {selectedFiles.length > 0 && (
                  <p className="text-sm text-primary mt-4 font-bold">{selectedFiles.length} files selected</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-medium mb-6">Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Price per Day (₹)</label>
                  <input {...register('pricePerDay')} type="number" placeholder="1000" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none rounded-xl text-foreground" />
                  {errors.pricePerDay && <span className="text-red-500 text-xs">{errors.pricePerDay.message as string}</span>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Security Deposit (₹)</label>
                  <input {...register('securityDeposit')} type="number" placeholder="5000" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none rounded-xl text-foreground" />
                  {errors.securityDeposit && <span className="text-red-500 text-xs">{errors.securityDeposit.message as string}</span>}
                  <p className="text-[10px] text-muted-foreground mt-2">Held on borrower&apos;s card, never charged unless required.</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-medium mb-6">Availability & Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Condition</label>
                  <select {...register('condition')} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none rounded-xl text-foreground">
                    <option value="new">Like New</option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Pickup Location</label>
                  <input {...register('location')} type="text" placeholder="e.g. Koramangala, Bangalore" className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none rounded-xl text-foreground" />
                  {errors.location && <span className="text-red-500 text-xs">{errors.location.message as string}</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Rental Rules (Optional)</label>
                <textarea {...register('rentalRules')} rows={3} placeholder="Any specific rules for the borrower..." className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none resize-none rounded-xl text-foreground" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2 font-bold">Cancellation Policy (Optional)</label>
                <textarea {...register('cancellationPolicy')} rows={3} placeholder="Flexible / Strict..." className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-primary outline-none resize-none rounded-xl text-foreground" />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="text-center py-12 animate-in slide-in-from-right-4">
              <div className="w-20 h-20 bg-emerald-500/15 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-emerald-700" />
              </div>
              <h2 className="text-2xl font-medium mb-2 text-foreground">Ready to Publish</h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto">
                Your listing will be submitted to the marketplace for immediate availability. Ensure your pricing and location details are accurate.
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between pt-6 border-t border-border">
        <button 
          onClick={prevStep}
          disabled={currentStep === 0 || isUploading}
          className="flex items-center gap-2 border border-border rounded-xl px-6 py-3 text-xs uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-muted transition-colors text-foreground"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        
        {currentStep === STEPS.length - 1 ? (
          <button 
            type="submit" 
            form="productForm" 
            disabled={isUploading}
            className="flex items-center gap-2 bg-primary text-primary-foreground rounded-xl px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-primary/90 transition-colors shadow-xs"
          >
            {isUploading ? 'Publishing...' : 'Publish Listing'} <CheckCircle className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={nextStep}
            className="flex items-center gap-2 bg-foreground text-background rounded-xl px-6 py-3 text-xs uppercase tracking-widest font-bold hover:bg-foreground/90 transition-colors shadow-xs"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
