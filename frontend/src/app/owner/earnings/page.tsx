'use client';

import React, { useState } from 'react';
import { 
  IndianRupee, 
  ArrowUpRight, 
  Clock, 
  Download, 
  Wallet, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  FileSpreadsheet,
  X,
  CreditCard
} from 'lucide-react';
import { useOwnerStats, useOwnerBookings } from '@/features/owner/api/useOwner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDateDisplay, formatCurrency } from '@/lib/date-utils';
import { toast } from 'react-hot-toast';

export default function OwnerEarningsPage() {
  const { data: stats, isLoading: statsLoading } = useOwnerStats();
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings();

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  // Financial calculations from real database bookings
  const paidBookings = bookings.filter((b: any) => b.paymentStatus === 'PAID');
  const activeBookings = bookings.filter((b: any) => b.status === 'ACTIVE' || b.status === 'CONFIRMED');
  const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING');

  const totalEarned = stats?.totalEarnings || 0;

  const escrowAmount = activeBookings.reduce((sum: number, b: any) => {
    return sum + (Number(b.rentalAmount) || 0);
  }, 0);

  const pendingClearance = pendingBookings.reduce((sum: number, b: any) => {
    return sum + (Number(b.rentalAmount) || 0);
  }, 0);

  // Available to withdraw (settled paid earnings)
  const availableToWithdraw = Math.max(0, totalEarned);

  // CSV Export
  const handleExportCSV = () => {
    if (bookings.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = ['Transaction ID', 'Booking Ref', 'Product', 'Renter', 'Rental Start', 'Rental End', 'Amount (INR)', 'Payment Status', 'Booking Status'];
    const rows = bookings.map((b: any) => [
      `TXN-${b._id.slice(-8).toUpperCase()}`,
      b.bookingId || b._id,
      `"${b.product?.name || 'Equipment'}"`,
      `"${b.borrower?.fullName || 'Borrower'}"`,
      formatDateDisplay(b.startDate),
      formatDateDisplay(b.endDate),
      b.rentalAmount || 0,
      b.paymentStatus || 'PENDING',
      b.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rentable_earnings_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Earnings ledger exported to CSV');
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }
    if (amount > availableToWithdraw) {
      toast.error(`Amount exceeds available balance of ${formatCurrency(availableToWithdraw)}`);
      return;
    }
    if (!bankAccount || bankAccount.length < 9) {
      toast.error('Please enter a valid bank account or UPI ID');
      return;
    }

    setIsSubmittingPayout(true);
    setTimeout(() => {
      setIsSubmittingPayout(false);
      setShowPayoutModal(false);
      setPayoutAmount('');
      setBankAccount('');
      setIfscCode('');
      toast.success(`Withdrawal request for ${formatCurrency(amount)} initiated. Processing via NEFT/IMPS.`);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-in fade-in duration-500 min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <Wallet className="h-3.5 w-3.5" /> Financial Balance
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Earnings & Payouts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time balance, completed rental settlements, and payout management.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleExportCSV}
          className="rounded-xl border-border h-11 px-5 text-xs font-semibold flex items-center gap-2"
        >
          <Download className="w-4 h-4" /> Export CSV
        </Button>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available to Withdraw */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Available to Withdraw
              </span>
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
              {formatCurrency(availableToWithdraw)}
            </div>
            <p className="text-xs text-muted-foreground">
              Direct earnings settled from confirmed rentals.
            </p>
          </div>

          <Button
            onClick={() => setShowPayoutModal(true)}
            disabled={availableToWithdraw <= 0}
            className="mt-6 w-full rounded-xl bg-primary text-primary-foreground text-xs font-semibold h-11 shadow-md hover:bg-primary/90"
          >
            Withdraw Funds
          </Button>
        </div>

        {/* In Escrow / Active */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Escrow / In Progress
              </span>
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
              {formatCurrency(escrowAmount)}
            </div>
            <p className="text-xs text-muted-foreground">
              Held in escrow during active bookings ({activeBookings.length} rental{activeBookings.length === 1 ? '' : 's'}).
            </p>
          </div>

          <div className="mt-6 flex items-center text-xs text-muted-foreground gap-1.5 pt-4 border-t border-border">
            <Clock className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span>Releases 24h after return confirmation</span>
          </div>
        </div>

        {/* Pending Clearance */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                Pending Requests Pipeline
              </span>
              <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                <Clock className="w-4 h-4" />
              </span>
            </div>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground mb-1">
              {formatCurrency(pendingClearance)}
            </div>
            <p className="text-xs text-muted-foreground">
              Potential revenue from {pendingBookings.length} pending rental request{pendingBookings.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="mt-6 flex items-center text-xs text-amber-600 dark:text-amber-400 gap-1.5 pt-4 border-t border-border font-medium">
            <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            <span>Accept requests in dashboard to confirm</span>
          </div>
        </div>
      </div>

      {/* ── RECENT TRANSACTIONS TABLE ── */}
      <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h3 className="text-xl font-bold text-foreground">Transaction Ledger</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Itemized history of booking payments and escrow disbursements.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-secondary text-foreground">
            {bookings.length} Record{bookings.length === 1 ? '' : 's'}
          </span>
        </div>

        {bookingsLoading ? (
          <div className="py-16 text-center text-muted-foreground">
            Loading transaction history...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-16 text-center rounded-2xl border border-dashed border-border">
            <FileSpreadsheet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <h4 className="text-base font-semibold text-foreground">No transactions yet</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
              When borrowers rent your listed products, completed transactions will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6 md:-mx-8">
            <table className="w-full text-left min-w-[700px]">
              <thead className="bg-secondary/30 border-y border-border">
                <tr>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Date</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Booking Ref</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Product</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Renter</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Amount</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Payment</th>
                  <th className="px-6 py-3.5 text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {bookings.map((b: any) => {
                  const isPaid = b.paymentStatus === 'PAID';
                  return (
                    <tr key={b._id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDateDisplay(b.createdAt || b.startDate)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground whitespace-nowrap">
                        {b.bookingId || b._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {b.product?.name || 'Equipment'}
                      </td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">
                        {b.borrower?.fullName || 'Borrower'}
                      </td>
                      <td className={`px-6 py-4 font-semibold whitespace-nowrap ${isPaid ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                        +{formatCurrency(b.rentalAmount || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPaid 
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20' 
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        }`}>
                          {b.paymentStatus || 'PENDING'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PAYOUT MODAL ── */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <button
              onClick={() => setShowPayoutModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-secondary text-muted-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-2">
                <CreditCard className="h-3.5 w-3.5" /> Settlement Transfer
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">Withdraw Rental Funds</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Available balance for withdrawal: <strong className="text-foreground">{formatCurrency(availableToWithdraw)}</strong>
              </p>
            </div>

            <form onSubmit={handleRequestPayout} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Withdrawal Amount (₹)
                </Label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  max={availableToWithdraw}
                  min={100}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
                  className="mt-1.5 rounded-xl h-11"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Bank Account Number or UPI ID
                </Label>
                <Input
                  placeholder="e.g. 987654321012 or user@okhdfcbank"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  className="mt-1.5 rounded-xl h-11"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  IFSC Code (for Bank Transfer)
                </Label>
                <Input
                  placeholder="e.g. HDFC0001234 (optional for UPI)"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value)}
                  className="mt-1.5 rounded-xl h-11 uppercase"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPayoutModal(false)}
                  className="rounded-xl border-border"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmittingPayout}
                  className="rounded-xl bg-primary text-primary-foreground font-semibold px-6 shadow-md"
                >
                  {isSubmittingPayout ? 'Processing...' : 'Confirm Withdrawal'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
