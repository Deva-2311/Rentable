'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  ArrowUpRight, 
  Eye, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock,
  IndianRupee,
  FileText
} from 'lucide-react';
import { useAdminStats, useAdminPayments } from '@/features/admin/api/useAdminDashboard';

export default function FinanceManagementPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: payments, isLoading: paymentsLoading } = useAdminPayments();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    return payments.filter((p: any) => {
      // Status filter
      if (statusFilter !== 'ALL' && p.status !== statusFilter) {
        return false;
      }
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const orderMatch = p.razorpayOrderId?.toLowerCase().includes(q);
        const payMatch = p.razorpayPaymentId?.toLowerCase().includes(q);
        const userMatch = p.user?.fullName?.toLowerCase().includes(q) || p.user?.email?.toLowerCase().includes(q);
        const bookingMatch = p.booking?.bookingId?.toLowerCase().includes(q) || String(p.booking?._id || p.booking).toLowerCase().includes(q);
        const idMatch = String(p._id).toLowerCase().includes(q);
        return orderMatch || payMatch || userMatch || bookingMatch || idMatch;
      }
      return true;
    });
  }, [payments, statusFilter, searchTerm]);

  const totalRevenue = stats?.totalRevenue ?? 0;
  const platformFee = Math.round(totalRevenue * 0.1);
  const successCount = (payments || []).filter((p: any) => p.status === 'SUCCESS').length;
  const failedCount = (payments || []).filter((p: any) => p.status === 'FAILED').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-heading">Financial Operations & Payment Ledger</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time MongoDB ledger tracking Razorpay orders, completed payouts, escrow fees, and failed charges.
          </p>
        </div>
        <div className="text-xs bg-secondary px-3 py-1.5 rounded-full border border-border text-muted-foreground font-mono">
          {payments?.length || 0} Total Transactions
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gross Rental Volume</span>
            <div className="p-2 rounded bg-emerald-500/15 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-medium text-foreground mb-1">
            {statsLoading ? '...' : `₹${totalRevenue.toLocaleString()}`}
          </div>
          <div className="text-xs text-muted-foreground flex items-center">
            <ArrowUpRight className="w-3 h-3 text-emerald-400 mr-1" />
            From {successCount} successful payments
          </div>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Platform Take (10%)</span>
            <div className="p-2 rounded bg-primary/10 text-primary">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-medium text-primary mb-1">
            {statsLoading ? '...' : `₹${platformFee.toLocaleString()}`}
          </div>
          <div className="text-xs text-muted-foreground">Commission & marketplace service fees</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed Charges</span>
            <div className="p-2 rounded bg-secondary text-foreground">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-medium text-foreground mb-1">
            {successCount}
          </div>
          <div className="text-xs text-emerald-400 font-medium">Verified in payment gateway</div>
        </div>

        <div className="bg-card border border-border p-5 rounded-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Failed / Declined</span>
            <div className="p-2 rounded bg-destructive/10 text-destructive">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-heading font-medium text-destructive mb-1">
            {failedCount}
          </div>
          <div className="text-xs text-muted-foreground">User card or checkout rejections</div>
        </div>
      </div>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search order ID, payment ID, payer, booking..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {['ALL', 'SUCCESS', 'FAILED', 'CREATED', 'REFUNDED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                statusFilter === st
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/60 border-b border-border text-[10px] uppercase text-muted-foreground tracking-wider font-semibold">
                <th className="p-4">Transaction / Order</th>
                <th className="p-4">Payer</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {paymentsLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Loading live payment ledger from MongoDB...
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No payment records found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((payment: any) => {
                  const amountRupees = Math.round((payment.amount || 0) / 100);
                  const isSuccess = payment.status === 'SUCCESS';
                  const isFailed = payment.status === 'FAILED';

                  return (
                    <tr key={payment._id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-mono text-xs">
                        <div className="font-semibold text-foreground truncate max-w-[160px]">
                          {payment.razorpayOrderId || String(payment._id).slice(-8)}
                        </div>
                        {payment.razorpayPaymentId && (
                          <div className="text-[11px] text-muted-foreground truncate max-w-[160px]">
                            {payment.razorpayPaymentId}
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-foreground">{payment.user?.fullName || 'Borrower'}</div>
                        <div className="text-xs text-muted-foreground">{payment.user?.email || 'N/A'}</div>
                      </td>
                      <td className="p-4 text-xs font-mono">
                        <span className="text-primary font-semibold">
                          {payment.booking?.bookingId || (payment.booking?._id ? String(payment.booking._id).slice(-8) : String(payment.booking).slice(-8))}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-foreground whitespace-nowrap">
                        ₹{amountRupees.toLocaleString()}
                        <span className="text-[10px] text-muted-foreground font-mono ml-1">{payment.currency || 'INR'}</span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                            isSuccess
                              ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/20'
                              : isFailed
                              ? 'bg-destructive/10 text-destructive border-destructive/20'
                              : 'bg-amber-500/15 text-amber-800 border-amber-500/20'
                          }`}
                        >
                          {isSuccess && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {isFailed && <XCircle className="w-3 h-3 mr-1" />}
                          {!isSuccess && !isFailed && <Clock className="w-3 h-3 mr-1" />}
                          {payment.status}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                        {payment.createdAt ? (
                          <>
                            <div>{new Date(payment.createdAt).toLocaleDateString()}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {new Date(payment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </>
                        ) : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="px-2.5 py-1.5 bg-secondary hover:bg-secondary/80 border border-border rounded text-xs font-semibold text-foreground transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Payment Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start pb-4 border-b border-border">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary font-bold block mb-1">
                  Payment Transaction Receipt
                </span>
                <h3 className="text-xl font-bold font-heading text-foreground">
                  Order: {selectedPayment.razorpayOrderId}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-secondary/40 rounded-lg border border-border">
                <span className="text-muted-foreground block mb-0.5">Payment Status</span>
                <span className={`font-bold text-sm ${selectedPayment.status === 'SUCCESS' ? 'text-emerald-400' : 'text-destructive'}`}>
                  {selectedPayment.status}
                </span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-lg border border-border">
                <span className="text-muted-foreground block mb-0.5">Amount Paid</span>
                <span className="font-bold text-sm text-foreground">
                  ₹{Math.round((selectedPayment.amount || 0) / 100).toLocaleString()} {selectedPayment.currency}
                </span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-lg border border-border">
                <span className="text-muted-foreground block mb-0.5">Razorpay Payment ID</span>
                <span className="font-mono text-foreground break-all">
                  {selectedPayment.razorpayPaymentId || 'N/A (Pending/Failed)'}
                </span>
              </div>
              <div className="p-3 bg-secondary/40 rounded-lg border border-border">
                <span className="text-muted-foreground block mb-0.5">Payment Method</span>
                <span className="font-medium text-foreground">
                  {selectedPayment.paymentMethod || 'RAZORPAY'}
                </span>
              </div>
            </div>

            <div className="space-y-2 p-3 bg-secondary/30 rounded-lg border border-border text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payer Name:</span>
                <span className="font-medium text-foreground">{selectedPayment.user?.fullName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payer Email:</span>
                <span className="font-medium text-foreground">{selectedPayment.user?.email || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Booking ID:</span>
                <span className="font-mono font-medium text-primary">
                  {selectedPayment.booking?.bookingId || String(selectedPayment.booking?._id || selectedPayment.booking)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">
                  {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-secondary text-muted-foreground hover:text-foreground text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

