'use client';

import { useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import apiClient from '@/lib/api/client';
import { toast } from 'react-hot-toast';

interface ImageUploaderProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export function ImageUploader({ value = [], onChange, maxFiles = 5 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      const remaining = maxFiles - value.length;
      if (remaining <= 0) {
        toast.error(`Maximum ${maxFiles} images allowed`);
        return;
      }

      const filesToUpload = files.slice(0, remaining);
      setUploading(true);

      try {
        const formData = new FormData();
        filesToUpload.forEach((file) => formData.append('files', file));

        const { data } = await apiClient.post<{ success: boolean; data: string[]; warning?: string }>(
          '/uploads/images',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );

        if (data.warning) toast(data.warning, { icon: '⚠️' });
        onChange([...value, ...data.data]);
        toast.success(`${filesToUpload.length} image${filesToUpload.length > 1 ? 's' : ''} uploaded`);
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } } };
        toast.error(error?.response?.data?.message || 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [value, onChange, maxFiles],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
      if (files.length) uploadFiles(files);
    },
    [uploadFiles],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) uploadFiles(files);
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 border-2 border-dashed transition-all duration-200 cursor-pointer py-12 ${
          dragOver ? 'border-foreground bg-muted/20' : 'border-border hover:border-foreground/50 hover:bg-muted/10'
        } ${value.length >= maxFiles ? 'opacity-40 pointer-events-none' : ''}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading || value.length >= maxFiles}
        />
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className="h-6 w-6 text-muted-foreground" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Drop images here or click to browse
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">
                {value.length}/{maxFiles} images · PNG, JPG, WebP · Max 10MB each
              </p>
            </div>
          </>
        )}
      </div>

      {/* Preview Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative aspect-square border border-border overflow-hidden group">
              <Image src={url} alt={`Image ${i + 1}`} fill sizes="160px" className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 bg-background/80 border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] font-bold uppercase tracking-widest bg-foreground text-background px-1.5 py-0.5">
                  Cover
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
