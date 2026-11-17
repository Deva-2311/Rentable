/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Clock, CheckCircle2, XCircle, Eye, Edit3, X, ToggleLeft, ToggleRight, DollarSign, Package } from 'lucide-react';
import { useAdminPendingProducts, useAdminApproveProduct, useAdminRejectProduct } from '@/features/admin/api/useAdminProducts';
import { useAdminProducts, useAdminToggleProductAvailability, useAdminUpdateProduct } from '@/features/admin/api/useAdminDashboard';
import { toast } from 'react-hot-toast';

export default function ProductManagementPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'active'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    pricePerDay: 0,
    securityDeposit: 0,
    availability: true,
  });

  const { data: pendingProducts, isLoading: pendingLoading } = useAdminPendingProducts();
  const { data: allProducts, isLoading: allLoading } = useAdminProducts();

  const approveMutation = useAdminApproveProduct();
  const rejectMutation = useAdminRejectProduct();
  const toggleAvailabilityMutation = useAdminToggleProductAvailability();
  const updateProductMutation = useAdminUpdateProduct();

  const isLoading = pendingLoading || allLoading;

  const filteredProducts = useMemo(() => {
    let list: any[] = [];
    if (activeTab === 'pending') {
      list = pendingProducts || [];
    } else if (activeTab === 'active') {
      list = (allProducts || []).filter((p: any) => (p.availability !== false && p.isAvailable !== false));
    } else {
      list = allProducts || [];
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.owner?.fullName?.toLowerCase().includes(q) ||
        p.category?.name?.toLowerCase().includes(q) ||
        p._id?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeTab, pendingProducts, allProducts, searchTerm]);

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this product listing for the marketplace?')) return;
    try {
      await approveMutation.mutateAsync(id);
      toast.success('Product listing approved and published');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to approve product');
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejecting this product:');
    if (!reason) return;
    try {
      await rejectMutation.mutateAsync({ id, reason });
      toast.success('Product listing rejected');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reject product');
    }
  };

  const handleToggleAvailability = async (product: any) => {
    const currentAvail = product.availability !== undefined ? product.availability : product.isAvailable !== false;
    try {
      await toggleAvailabilityMutation.mutateAsync(product._id);
      toast.success(`Product is now ${currentAvail ? 'Unavailable (Hidden)' : 'Available (Visible)'}`);
      if (selectedProduct && selectedProduct._id === product._id) {
        setSelectedProduct({ ...selectedProduct, availability: !currentAvail });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to toggle product availability');
    }
  };

  const openEditModal = (product: any) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name || '',
      description: product.description || '',
      pricePerDay: product.pricePerDay || 0,
      securityDeposit: product.securityDeposit || 0,
      availability: product.availability !== undefined ? product.availability : product.isAvailable !== false,
    });
    setIsEditing(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    try {
      await updateProductMutation.mutateAsync({
        id: selectedProduct._id,
        payload: {
          name: editForm.name,
          description: editForm.description,
          pricePerDay: editForm.pricePerDay,
          securityDeposit: editForm.securityDeposit,
          availability: editForm.availability,
        },
      });
      toast.success('Product details updated successfully in database');
      setIsEditing(false);
      setSelectedProduct({ ...selectedProduct, ...editForm });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Products Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Review, moderate, edit pricing, and toggle catalog inventory.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border pb-px">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          All Inventory <span className="bg-secondary text-foreground px-2 py-0.5 rounded text-xs font-mono border border-border">{allProducts?.length || 0}</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'pending' ? 'border-amber-600 text-amber-700' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending Review <span className="bg-amber-500/15 text-amber-800 border border-amber-300 px-2 py-0.5 rounded text-xs font-mono">{pendingProducts?.length || 0}</span>
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Active Listings
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-2xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, owner, or category..."
            className="w-full bg-secondary/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
        <div className="text-xs text-muted-foreground font-mono font-medium">
          Showing {filteredProducts.length} items
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-[11px] uppercase text-muted-foreground tracking-wider font-semibold">
                <th className="p-4">Product</th>
                <th className="p-4">Category & Owner</th>
                <th className="p-4">Rental Price</th>
                <th className="p-4">Deposit</th>
                <th className="p-4">Status / Visibility</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading marketplace inventory...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No products match your criteria</td>
                </tr>
              ) : (
                filteredProducts.map((product: any) => (
                  <tr key={product._id} className="hover:bg-secondary/25 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mr-3 overflow-hidden shrink-0 border border-border">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="max-w-[200px] sm:max-w-xs">
                          <div className="text-sm font-semibold text-foreground truncate">{product.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">ID: {product._id?.toString().slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="text-foreground font-medium">{product.category?.name || 'Uncategorized'}</div>
                      <div className="text-xs text-muted-foreground">Owner: {product.owner?.fullName || 'Unknown'}</div>
                    </td>
                    <td className="p-4 text-sm font-bold whitespace-nowrap text-foreground">
                      ₹{product.pricePerDay}/day
                    </td>
                    <td className="p-4 text-sm whitespace-nowrap text-muted-foreground">
                      ₹{product.securityDeposit || 0}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1 items-start">
                        {product.status === 'PENDING_APPROVAL' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3 mr-1" /> Pending Approval
                          </span>
                        ) : product.status === 'REJECTED' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/15 text-red-800 border border-red-300">
                            <XCircle className="w-3 h-3 mr-1" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> {product.status || 'ACTIVE'}
                          </span>
                        )}
                        {(() => {
                          const isAvail = product.availability !== undefined ? product.availability : product.isAvailable !== false;
                          return (
                            <span className={`text-[10px] uppercase font-bold tracking-wider ${isAvail ? 'text-emerald-700' : 'text-muted-foreground'}`}>
                              {isAvail ? '• Listed & Available' : '• Delisted / Hidden'}
                            </span>
                          );
                        })()}
                      </div>
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      {product.status === 'PENDING_APPROVAL' ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleApprove(product._id)}
                            disabled={approveMutation.isPending}
                            className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-2xs disabled:opacity-50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(product._id)}
                            disabled={rejectMutation.isPending}
                            className="text-xs border border-red-300 bg-red-500/10 text-red-700 px-3 py-1.5 rounded-lg font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end space-x-2">
                          {(() => {
                            const isAvail = product.availability !== undefined ? product.availability : product.isAvailable !== false;
                            return (
                              <button
                                onClick={() => handleToggleAvailability(product)}
                                disabled={toggleAvailabilityMutation.isPending}
                                title={isAvail ? 'Hide from marketplace' : 'Make available on marketplace'}
                                className={`text-xs px-3 py-1.5 border rounded-lg font-semibold transition-colors ${
                                  isAvail
                                    ? 'border-amber-300 bg-amber-500/10 text-amber-800 hover:bg-amber-500/20'
                                    : 'border-emerald-300 bg-emerald-500/10 text-emerald-800 hover:bg-emerald-500/20'
                                }`}
                              >
                                {isAvail ? 'Deactivate' : 'Activate'}
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => openEditModal(product)}
                            className="text-xs border border-border bg-card text-foreground hover:bg-secondary px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" /> Edit
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Permitted Fields Modal */}
      {isEditing && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start border-b border-border pb-4">
              <div>
                <h3 className="text-lg font-bold font-heading text-foreground">Edit Product Details</h3>
                <p className="text-xs text-muted-foreground font-mono">ID: {selectedProduct._id}</p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-secondary transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    Daily Rate (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editForm.pricePerDay}
                    onChange={(e) => setEditForm({ ...editForm, pricePerDay: Number(e.target.value) })}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={editForm.securityDeposit}
                    onChange={(e) => setEditForm({ ...editForm, securityDeposit: Number(e.target.value) })}
                    className="w-full bg-secondary/50 border border-border rounded-lg px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-secondary/40 p-3.5 rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="modalIsAvailable"
                  checked={editForm.availability}
                  onChange={(e) => setEditForm({ ...editForm, availability: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded border-border"
                />
                <label htmlFor="modalIsAvailable" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Product is listed & available for rental
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground border border-border rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProductMutation.isPending}
                  className="px-5 py-2 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors shadow-2xs disabled:opacity-50"
                >
                  {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
