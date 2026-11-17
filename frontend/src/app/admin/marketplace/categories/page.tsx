'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Trash2, X, FolderTree, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/admin/api/useAdminDashboard';
import { toast } from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<any | null>(null);

  const [formState, setFormState] = useState({
    name: '',
    slug: '',
    description: '',
    isActive: true,
  });

  const { data: categories, isLoading } = useAdminCategories();
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    if (!searchTerm.trim()) return categories;
    const q = searchTerm.toLowerCase();
    return categories.filter((c: any) =>
      c.name?.toLowerCase().includes(q) ||
      c.slug?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  }, [categories, searchTerm]);

  const openAddModal = () => {
    setFormState({ name: '', slug: '', description: '', isActive: true });
    setIsAddModalOpen(true);
  };

  const openEditModal = (category: any) => {
    setEditingCategory(category);
    setFormState({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      isActive: category.isActive !== false,
    });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    const autoSlug = formState.slug.trim() || formState.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    try {
      await createCategoryMutation.mutateAsync({
        name: formState.name.trim(),
        slug: autoSlug,
        description: formState.description.trim() || undefined,
      });
      toast.success('Category created successfully');
      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create category');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    if (!formState.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory._id,
        payload: {
          name: formState.name.trim(),
          slug: formState.slug.trim() || undefined,
          description: formState.description.trim() || undefined,
          isActive: formState.isActive,
        },
      });
      toast.success('Category updated successfully');
      setEditingCategory(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update category');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategoryMutation.mutateAsync(deletingCategory._id);
      toast.success(`Category "${deletingCategory.name}" removed successfully`);
      setDeletingCategory(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories Taxonomy</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage marketplace catalog groupings, taxonomy, and search slugs.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name, slug, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="text-xs text-muted-foreground font-mono">
          {filteredCategories.length} categories active
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-xs uppercase text-muted-foreground tracking-wider">
                <th className="p-4 font-medium">Category Name</th>
                <th className="p-4 font-medium">Slug URL</th>
                <th className="p-4 font-medium">Description</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">Loading categories from database...</td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No categories found</td>
                </tr>
              ) : (
                filteredCategories.map((category: any) => (
                  <tr key={category._id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary shrink-0 border border-border">
                          <FolderTree className="w-4 h-4" />
                        </div>
                        <div className="font-medium text-foreground text-sm">{category.name}</div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-mono text-muted-foreground">
                      /{category.slug}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground max-w-sm truncate">
                      {category.description || 'No description provided'}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
                        category.isActive !== false
                          ? 'bg-emerald-500/15 text-emerald-800 border border-emerald-500/20'
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}>
                        {category.isActive !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(category)}
                          className="p-1.5 rounded border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          title="Edit Category"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingCategory(category)}
                          disabled={deleteCategoryMutation.isPending}
                          className="p-1.5 rounded border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">Add New Category</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Drones & Audio"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  URL Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. drones-audio"
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Brief summary of items in this category"
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategoryMutation.isPending}
                  className="px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {createCategoryMutation.isPending ? 'Saving...' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="text-lg font-bold text-foreground">Edit Category</h3>
              <button onClick={() => setEditingCategory(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  URL Slug (Unique path identifier)
                </label>
                <input
                  type="text"
                  value={formState.slug}
                  onChange={(e) => setFormState({ ...formState, slug: e.target.value })}
                  placeholder="e.g. drones-audio"
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none font-mono text-xs"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Used in routes: /categories/[slug]</p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 bg-secondary/40 p-3 rounded-lg border border-border">
                <input
                  type="checkbox"
                  id="catIsActive"
                  checked={formState.isActive}
                  onChange={(e) => setFormState({ ...formState, isActive: e.target.checked })}
                  className="w-4 h-4 accent-primary rounded"
                />
                <label htmlFor="catIsActive" className="text-sm font-medium text-foreground cursor-pointer">
                  Category is Active & Visible in Browse Filters
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateCategoryMutation.isPending}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {updateCategoryMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {updateCategoryMutation.isPending ? 'Saving...' : 'Update Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Modal */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Delete Category</h3>
                <p className="text-xs text-muted-foreground">This operation permanently removes the catalog entry.</p>
              </div>
            </div>

            <div className="bg-secondary/40 p-4 rounded-xl border border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Category Name:</span>
                <span className="font-semibold text-foreground">{deletingCategory.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">URL Slug:</span>
                <span className="font-mono text-xs text-foreground">/{deletingCategory.slug}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 leading-relaxed">
              <strong>Data Integrity Policy:</strong> If any products in the marketplace currently reference this category, deletion will be blocked by system rules to avoid orphaned catalog items.
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
                disabled={deleteCategoryMutation.isPending}
                className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleteCategoryMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {deleteCategoryMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleteCategoryMutation.isPending ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
