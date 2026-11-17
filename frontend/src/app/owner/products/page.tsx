'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Eye, 
  Edit3, 
  Trash2, 
  Power, 
  LayoutGrid, 
  List,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useMyProducts, useUpdateProduct, useDeleteProduct } from '@/features/products/api/useProducts';
import { Product } from '@/types/product';
import { EditProductModal } from '@/components/products/EditProductModal';
import { CreateProductModal } from '@/components/products/CreateProductModal';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function OwnerProductsPage() {
  const router = useRouter();
  const { data: products = [], isLoading, refetch } = useMyProducts();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [view, setView] = useState<'grid' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'PENDING_APPROVAL'>('ALL');
  
  // Modals state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p: Product) => {
      const matchesSearch = 
        !searchTerm || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.location && p.location.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        statusFilter === 'ALL' || p.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const handleToggleStatus = async (product: Product) => {
    const nextStatus = product.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE';
    try {
      await updateProductMutation.mutateAsync({
        id: product._id,
        payload: { status: nextStatus },
      });
      toast.success(`Listing status updated to ${nextStatus}`);
      refetch();
    } catch {
      toast.error('Failed to change listing status');
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteProductMutation.mutateAsync(deletingProduct._id);
      toast.success('Product deleted successfully');
      setDeletingProduct(null);
      refetch();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground mb-2">Inventory Management</p>
          <h1 className="text-3xl font-light text-foreground">My Products & Gear</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {products.length} registered item{products.length === 1 ? '' : 's'} in your fleet
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)} 
          className="bg-primary text-primary-foreground font-semibold px-5 h-11 shadow-xs hover:bg-primary/90"
        >
          <Plus className="w-4 h-4 mr-2" /> Add New Gear
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search gear by name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-background border border-border pl-9 pr-4 py-2 text-xs rounded-lg focus:border-foreground/40 outline-none" 
            />
          </div>

          {/* Status filter pills */}
          <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background">
            {(['ALL', 'ACTIVE', 'PAUSED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-colors ${
                  statusFilter === st 
                    ? 'bg-foreground text-background' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-1 border border-border rounded-lg p-1 bg-background">
          <button 
            type="button"
            onClick={() => setView('table')} 
            className={`p-1.5 rounded text-xs transition-colors ${view === 'table' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Table View"
          >
            <List className="w-4 h-4" />
          </button>
          <button 
            type="button"
            onClick={() => setView('grid')} 
            className={`p-1.5 rounded text-xs transition-colors ${view === 'grid' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="text-center py-20 text-sm text-muted-foreground animate-pulse space-y-3">
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          <p>Loading inventory from database...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="border border-dashed border-border bg-card p-12 text-center rounded-2xl flex flex-col items-center justify-center max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading text-foreground mb-1">
              {searchTerm || statusFilter !== 'ALL' ? 'No matching products found' : 'No products listed yet'}
            </h3>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {searchTerm || statusFilter !== 'ALL'
                ? 'Try clearing your search query or switching filters.'
                : 'Start earning rental income by listing your physical equipment with insured escrow.'}
            </p>
          </div>
          {searchTerm || statusFilter !== 'ALL' ? (
            <Button 
              variant="outline" 
              onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
              className="text-xs"
            >
              Reset Filters
            </Button>
          ) : (
            <Button onClick={() => setShowCreateModal(true)} className="text-xs font-semibold px-6">
              <Plus className="w-4 h-4 mr-2" /> List Your First Item
            </Button>
          )}
        </div>
      ) : view === 'table' ? (
        /* TABLE VIEW */
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
          <table className="w-full text-left">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Product</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Category</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Daily Rate</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Deposit</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Status</th>
                <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-muted-foreground font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product: Product) => (
                <tr key={product._id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted border border-border rounded-lg overflow-hidden shrink-0 relative">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] uppercase tracking-wider text-muted-foreground">
                            No Img
                          </div>
                        )}
                      </div>
                      <div>
                        <Link 
                          href={`/products/${product._id}`}
                          className="font-medium text-sm text-foreground hover:text-primary transition-colors block leading-snug"
                        >
                          {product.name}
                        </Link>
                        <span className="text-[11px] text-muted-foreground">
                          {product.location || 'Local Delivery'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    {typeof product.category === 'object' && product.category?.name
                      ? product.category.name
                      : 'General'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-sm text-foreground">
                    ₹{product.pricePerDay?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                    ₹{product.securityDeposit?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-500/20">
                        <CheckCircle className="w-3 h-3" /> Active
                      </span>
                    ) : product.status === 'PAUSED' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 rounded-full border border-amber-500/20">
                        <Clock className="w-3 h-3" /> Paused
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold bg-muted text-muted-foreground rounded-full border border-border">
                        <AlertCircle className="w-3 h-3" /> {product.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="text-muted-foreground hover:text-foreground p-2 rounded-lg hover:bg-secondary transition-colors outline-hidden">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-card border-border shadow-lg">
                        <DropdownMenuItem 
                          onClick={() => router.push(`/products/${product._id}`)}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Listing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => setEditingProduct(product)}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(product)}
                          className="cursor-pointer flex items-center gap-2"
                        >
                          <Power className="w-3.5 h-3.5" />
                          {product.status === 'ACTIVE' ? 'Pause Listing' : 'Activate Listing'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setDeletingProduct(product)}
                          className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product: Product) => (
            <div 
              key={product._id} 
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs uppercase text-muted-foreground">
                    No Image
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md ${
                    product.status === 'ACTIVE' 
                      ? 'bg-emerald-500/90 text-white' 
                      : 'bg-black/70 text-white'
                  }`}>
                    {product.status}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full backdrop-blur-xs transition-colors outline-hidden">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 bg-card border-border shadow-lg">
                      <DropdownMenuItem 
                        onClick={() => router.push(`/products/${product._id}`)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Listing
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setEditingProduct(product)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Details
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleToggleStatus(product)}
                        className="cursor-pointer flex items-center gap-2"
                      >
                        <Power className="w-3.5 h-3.5" />
                        {product.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setDeletingProduct(product)}
                        className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
                    {typeof product.category === 'object' && product.category?.name
                      ? product.category.name
                      : 'Gear'}
                  </p>
                  <Link 
                    href={`/products/${product._id}`}
                    className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {product.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Rate</span>
                    <span className="text-lg font-bold text-foreground">₹{product.pricePerDay?.toLocaleString()} <span className="text-xs font-normal text-muted-foreground">/day</span></span>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setEditingProduct(product)}
                    className="text-xs font-semibold rounded-lg"
                  >
                    Edit Gear
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditProductModal 
        product={editingProduct} 
        open={Boolean(editingProduct)} 
        onClose={() => setEditingProduct(null)} 
        onSuccess={() => refetch()} 
      />

      {/* Create Modal */}
      <CreateProductModal 
        open={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          refetch();
        }} 
      />

      {/* Delete Confirmation Dialog */}
      {deletingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold font-heading text-destructive flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Delete Product Listing
            </h3>
            <p className="text-sm text-foreground leading-relaxed">
              Are you sure you want to delete <strong>{deletingProduct.name}</strong>? This action permanently removes the asset and its booking calendar from RENTABLE.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setDeletingProduct(null)}
                disabled={deleteProductMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteProductMutation.isPending}
              >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Confirm Deletion'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
