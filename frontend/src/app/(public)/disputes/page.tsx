"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDisputes, useCreateDispute, DisputeItem } from "@/features/disputes/api/useDisputes";
import { useMyBookings, useOwnerRequests } from "@/features/bookings/api/useBookings";
import { ImageUploader } from "@/components/uploads/ImageUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  Scale, 
  AlertCircle, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  FileText,
  X,
  Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatDateDisplay } from "@/lib/date-utils";

const DISPUTE_REASONS = [
  "Item Damaged during Rental",
  "Item Not as Described",
  "Late Return / Overstay",
  "Missing Accessories or Components",
  "Security Deposit Dispute",
  "Pickup / Delivery Non-fulfillment",
  "Other Policy Violation",
];

export default function DisputesPage() {
  const { user } = useAuth();
  const { data: disputes, isLoading, refetch } = useDisputes();
  const { data: borrowerBookings } = useMyBookings();
  const { data: ownerBookings } = useOwnerRequests();
  const { mutateAsync: createDispute, isPending: isSubmitting } = useCreateDispute();

  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<DisputeItem | null>(null);

  // Form State
  const [bookingId, setBookingId] = useState("");
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState("");
  const [evidenceUrls, setEvidenceUrls] = useState<string[]>([]);
  const [formError, setFormError] = useState("");

  // Combine bookings for dropdown selection
  const userBookings = [
    ...(borrowerBookings || []).map(b => ({
      id: b._id,
      label: `${b.product?.name || "Product"} (Ref: ${b.bookingId || b._id.slice(-6)}) - ${b.status}`
    })),
    ...(ownerBookings || []).map(b => ({
      id: b._id,
      label: `[Owner] ${b.product?.name || "Product"} (Ref: ${b.bookingId || b._id.slice(-6)}) - ${b.status}`
    }))
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!bookingId.trim()) {
      setFormError("Please select or enter a valid Booking Reference.");
      return;
    }
    if (!description.trim() || description.trim().length < 20) {
      setFormError("Please provide a comprehensive description (at least 20 characters).");
      return;
    }

    try {
      await createDispute({
        bookingId: bookingId.trim(),
        reason,
        description: description.trim(),
        evidenceUrls,
      });
      toast.success("Dispute submitted successfully. Our mediation team will review your case.");
      setShowFileModal(false);
      setBookingId("");
      setDescription("");
      setEvidenceUrls([]);
      refetch();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit dispute";
      setFormError(msg);
      toast.error(msg);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OPENED":
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30">Under Review</span>;
      case "UNDER_REVIEW":
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30">Admin Investigating</span>;
      case "EVIDENCE_REQUESTED":
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-400 border border-purple-500/30">Evidence Needed</span>;
      case "RESOLVED":
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">Resolved</span>;
      case "CLOSED":
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-zinc-500/15 text-zinc-700 dark:text-zinc-400 border border-zinc-500/30">Closed</span>;
      default:
        return <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">{status}</span>;
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-32 max-w-5xl min-h-screen">
      {/* ── HEADER ── */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
          <Scale className="h-4 w-4" /> Resolution & Escrow Mediation
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          Dispute Resolution Center
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Fair, transparent mediation protecting both equipment owners and renters through objective evidence and secure escrow management.
        </p>

        {user ? (
          <div className="mt-8 flex justify-center gap-4">
            <Button 
              onClick={() => setShowFileModal(true)}
              className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 h-12 shadow-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Open Resolution Case
            </Button>
          </div>
        ) : (
          <div className="mt-8 p-4 rounded-2xl bg-secondary/30 border border-border inline-flex items-center gap-4 text-left">
            <AlertCircle className="h-5 w-5 text-primary shrink-0" />
            <div className="text-sm">
              <span className="font-semibold text-foreground">Have an active rental dispute? </span>
              <span className="text-muted-foreground">Sign in to review your cases or file a new claim.</span>
            </div>
            <Link 
              href="/login?redirect=/disputes" 
              className="inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-xs"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* ── 3 PILLARS OF RESOLUTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-foreground">Escrow Protection</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Rental payments and security deposits are held in trust until both parties confirm satisfactory gear handover or a dispute is settled.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4">
            <Clock className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-foreground">48-Hour Guarantee</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Claims are assigned to dedicated marketplace mediators who review timestamps, condition photos, and communications within 48 hours.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-border shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-foreground">Impartial Settlement</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Resolutions can issue full or partial deposit deductions, rental fee refunds, or repair fee disbursements based strictly on verified evidence.
          </p>
        </div>
      </div>

      {/* ── USER'S ACTIVE DISPUTES (IF LOGGED IN) ── */}
      {user && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Your Resolution Cases</h2>
              <p className="text-sm text-muted-foreground">Track ongoing mediation claims for your rentals.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="rounded-xl border-border text-xs"
            >
              Refresh Cases
            </Button>
          </div>

          {isLoading ? (
            <div className="p-12 text-center rounded-2xl border border-border bg-card">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
              <p className="text-sm text-muted-foreground">Loading your cases...</p>
            </div>
          ) : !disputes || disputes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-card/50">
              <ShieldCheck className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-foreground mb-1">No Active Disputes</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                All your past and ongoing rental bookings are currently in good standing.
              </p>
              <Button 
                onClick={() => setShowFileModal(true)} 
                variant="outline"
                className="rounded-xl border-border"
              >
                Open a Resolution Case
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((d) => {
                const prod = typeof d.product === "object" ? d.product : null;
                const book = typeof d.booking === "object" ? d.booking : null;
                const target = typeof d.targetUser === "object" ? d.targetUser : null;
                const opener = typeof d.openedBy === "object" ? d.openedBy : null;
                const isOpener = user._id === (opener?._id || d.openedBy);

                return (
                  <div 
                    key={d._id} 
                    className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all shadow-xs flex flex-col md:flex-row justify-between gap-6"
                  >
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs font-bold text-muted-foreground">
                          CASE-{d._id.slice(-6).toUpperCase()}
                        </span>
                        {getStatusBadge(d.status)}
                        <span className="text-xs text-muted-foreground">
                          Opened {formatDateDisplay(d.createdAt)}
                        </span>
                      </div>

                      <h4 className="text-lg font-semibold text-foreground">{d.reason}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">{d.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground pt-1">
                        <span>Gear: <strong className="text-foreground">{prod?.name || "Rental Asset"}</strong></span>
                        <span>•</span>
                        <span>Booking: <strong className="text-foreground">{book?.bookingId || "Active"}</strong></span>
                        <span>•</span>
                        <span>
                          {isOpener ? `Against: ${target?.fullName || "Counterparty"}` : `Filed by: ${opener?.fullName || "Borrower"}`}
                        </span>
                        {d.evidenceUrls?.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-primary font-semibold">
                              {d.evidenceUrls.length} Evidence Photo(s) Attached
                            </span>
                          </>
                        )}
                      </div>

                      {/* Resolution Banner if resolved */}
                      {d.resolution && (
                        <div className="mt-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                          <p className="font-bold flex items-center gap-1.5 mb-1">
                            <CheckCircle2 className="h-4 w-4" /> Mediation Resolution: {d.resolution.action.replace(/_/g, ' ')}
                          </p>
                          <p>{d.resolution.reason}</p>
                          {d.resolution.amount && (
                            <p className="mt-1 font-semibold">Awarded Amount: ₹{d.resolution.amount.toLocaleString()}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center md:items-end justify-between md:justify-center shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDispute(d)}
                        className="rounded-xl border-border text-xs font-semibold"
                      >
                        View Full Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── FAQ & GUIDELINES ── */}
      <div className="rounded-3xl border border-border bg-card p-8 md:p-12 mb-16 shadow-xs">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">
          Dispute Resolution Policies & FAQ
        </h2>
        <div className="space-y-6">
          <div className="border-b border-border pb-6">
            <h4 className="font-semibold text-foreground text-base mb-2">When should I file a dispute?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Disputes should be opened within 48 hours of return inspection if an item is returned damaged, missing parts, or if a renter refuses to return equipment on time. Borrowers can file if the item was fundamentally defective or unavailable upon pickup.
            </p>
          </div>
          <div className="border-b border-border pb-6">
            <h4 className="font-semibold text-foreground text-base mb-2">What evidence is required?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              High-resolution photographs of condition prior to checkout and after return, serial numbers, diagnostic receipts from certified repair centers, and chat logs inside RENTABLE.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground text-base mb-2">How are security deposits disbursed?</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              When a dispute is resolved in favor of the equipment owner, the certified repair or replacement cost is deducted directly from the borrower's held security deposit and paid to the owner. Remaining funds are refunded to the borrower.
            </p>
          </div>
        </div>
      </div>

      {/* ── FILE DISPUTE MODAL ── */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setShowFileModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <ShieldAlert className="h-3.5 w-3.5" /> File a Mediation Claim
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Open Resolution Request</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Provide clear, factual details to help our team mediate your rental issue promptly.
              </p>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Booking
                </Label>
                {userBookings.length > 0 ? (
                  <select
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="w-full mt-1.5 h-11 px-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">-- Select an eligible rental booking --</option>
                    {userBookings.map((b) => (
                      <option key={b.id} value={b.id}>{b.label}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    placeholder="Enter Booking ID (e.g., 67ba...)"
                    value={bookingId}
                    onChange={(e) => setBookingId(e.target.value)}
                    className="mt-1.5 rounded-xl h-11"
                    required
                  />
                )}
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Dispute Reason
                </Label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full mt-1.5 h-11 px-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                >
                  {DISPUTE_REASONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Factual Description
                </Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Explain what happened in detail, including dates, exact damages or discrepancy, and any prior communication..."
                  className="w-full mt-1.5 p-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-hidden focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 block">
                  Evidence Photos (Recommended)
                </Label>
                <ImageUploader
                  value={evidenceUrls}
                  onChange={setEvidenceUrls}
                  maxFiles={4}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowFileModal(false)}
                  className="rounded-xl border-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
                    </>
                  ) : (
                    "Submit for Mediation"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── CASE DETAILS MODAL ── */}
      {selectedDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative">
            <button 
              onClick={() => setSelectedDispute(null)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs font-bold text-muted-foreground">
                CASE-{selectedDispute._id.slice(-6).toUpperCase()}
              </span>
              {getStatusBadge(selectedDispute.status)}
            </div>

            <h3 className="text-2xl font-bold tracking-tight text-foreground mb-4">
              {selectedDispute.reason}
            </h3>

            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Summary</p>
                <p className="text-foreground leading-relaxed">{selectedDispute.description}</p>
              </div>

              {selectedDispute.evidenceUrls?.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Submitted Evidence</p>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedDispute.evidenceUrls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noreferrer" className="block relative aspect-video rounded-lg overflow-hidden border border-border hover:opacity-90">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Evidence" className="object-cover w-full h-full" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedDispute.resolution && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Resolution Verdict</p>
                  <p className="font-semibold text-foreground">{selectedDispute.resolution.action.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{selectedDispute.resolution.reason}</p>
                  {selectedDispute.resolution.amount && (
                    <p className="text-sm font-bold text-emerald-600">Disbursed: ₹{selectedDispute.resolution.amount.toLocaleString()}</p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedDispute(null)} className="rounded-xl">
                Close Case Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
