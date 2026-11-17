'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Info, 
  Trash2, 
  Star, 
  Search, 
  CheckCircle2, 
  MessageSquare,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAdminReviews, useAdminDeleteReview } from '@/features/admin/api/useAdminDashboard';
import { toast } from 'react-hot-toast';

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useAdminReviews();
  const deleteMutation = useAdminDeleteReview();

  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('ALL');
  const [deletingReview, setDeletingReview] = useState<any | null>(null);

  const filteredReviews = useMemo(() => {
    if (!reviews) return [];
    return reviews.filter((r: any) => {
      // Rating filter
      if (ratingFilter !== 'ALL' && String(r.rating) !== ratingFilter) {
        return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const reviewerMatch = r.reviewer?.fullName?.toLowerCase().includes(q) || r.reviewer?.email?.toLowerCase().includes(q);
        const productMatch = r.product?.name?.toLowerCase().includes(q);
        const commentMatch = r.comment?.toLowerCase().includes(q);
        const bookingMatch = r.booking?.bookingId?.toLowerCase().includes(q);
        return reviewerMatch || productMatch || commentMatch || bookingMatch;
      }
      return true;
    });
  }, [reviews, ratingFilter, searchTerm]);

  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    try {
      await deleteMutation.mutateAsync(deletingReview._id);
      toast.success('Review removed and moderation logged in audit trail');
      setDeletingReview(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to remove review');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Reviews & Moderation Pool</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Verified equipment reviews persisted in MongoDB. Moderate abusive or non-compliant feedback.
          </p>
        </div>
        <div className="text-xs bg-secondary px-3 py-1.5 rounded-full border border-border text-muted-foreground font-mono">
          Total: {reviews?.length || 0} Reviews
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-3 text-xs text-muted-foreground shadow-sm">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <span>
          Reviews are submitted by verified borrowers upon rental completion. Deleting a review removes it from public product listings and creates an immutable <span className="font-semibold text-primary">REVIEW_DELETED</span> record in the MongoDB audit trail.
        </span>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product, reviewer, or review text..."
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground font-medium">Rating:</span>
          {['ALL', '5', '4', '3', '2', '1'].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                ratingFilter === r
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {r === 'ALL' ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2 bg-card rounded-xl border border-border">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm">Loading reviews from database...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground bg-card rounded-xl border border-border">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium">No customer reviews found matching criteria.</p>
          </div>
        ) : (
          filteredReviews.map((review: any) => (
            <div key={review._id} className="border border-border bg-card rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:border-primary/30 transition-colors">
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-foreground">
                        {review.reviewer?.fullName || 'Anonymous Borrower'}
                      </span>
                      <span className="text-xs text-muted-foreground">reviewed</span>
                      <span className="text-sm font-medium text-primary">
                        {review.product?.name || 'Equipment Asset'}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {review.reviewer?.email && <span>{review.reviewer.email} • </span>}
                      {review.booking?.bookingId && (
                        <span className="font-mono text-primary font-medium">
                          Ref: {review.booking.bookingId} •{' '}
                        </span>
                      )}
                      <span>
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center bg-secondary px-3 py-1 rounded-md border border-border">
                    <span className="text-sm font-bold text-amber-700 mr-1.5">{review.rating}</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${
                            s <= review.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/50 p-4 border border-border rounded-lg">
                  <p className="text-sm text-foreground/90 italic">&quot;{review.comment}&quot;</p>
                </div>
              </div>

              <div className="w-full md:w-56 flex flex-col justify-between gap-3 shrink-0 border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div>
                    Status: <span className="text-emerald-800 font-semibold uppercase tracking-wider text-[10px]">Published</span>
                  </div>
                  <div className="font-mono text-[11px] truncate">
                    ID: {String(review._id).slice(-8)}
                  </div>
                </div>

                <button
                  onClick={() => setDeletingReview(review)}
                  disabled={deleteMutation.isPending}
                  className="w-full py-2 px-3 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  title="Moderate and remove violating review"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Moderate / Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Review Confirmation Modal */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Confirm Review Moderation</h3>
                <p className="text-xs text-muted-foreground">Permanent removal from marketplace catalog</p>
              </div>
            </div>

            <div className="bg-secondary/40 p-4 rounded-xl border border-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Reviewer:</span>
                <span className="font-semibold text-foreground">{deletingReview.reviewer?.fullName || 'Anonymous'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Product:</span>
                <span className="font-semibold text-foreground truncate max-w-xs">{deletingReview.product?.name || 'Item'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-xs uppercase font-medium">Rating:</span>
                <span className="font-bold text-amber-700">{deletingReview.rating} / 5 Stars</span>
              </div>
              <div className="pt-2 border-t border-border">
                <span className="text-muted-foreground text-xs uppercase font-medium block mb-1">Comment:</span>
                <p className="text-xs text-foreground/90 italic bg-card p-2.5 rounded border border-border">&quot;{deletingReview.comment}&quot;</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 leading-relaxed">
              <strong>Audit Record:</strong> This action will delete the review from MongoDB and automatically record an immutable <span className="font-mono font-semibold">REVIEW_DELETED</span> entry in the audit trail.
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <button
                type="button"
                onClick={() => setDeletingReview(null)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 text-xs font-semibold bg-secondary text-foreground border border-border rounded-md hover:bg-secondary/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-destructive text-white rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50"
              >
                {deleteMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {deleteMutation.isPending ? 'Removing...' : 'Confirm Moderation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

