'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2, 
  User, 
  ArrowRight,
  Filter,
  Eye,
  CalendarDays
} from 'lucide-react';
import { useOwnerProducts, useOwnerBookings } from '@/features/owner/api/useOwner';
import { Button } from '@/components/ui/button';
import { BookingDetailModal } from '@/components/bookings/BookingDetailModal';
import { formatDateDisplay, formatCurrency } from '@/lib/date-utils';

export default function OwnerCalendarPage() {
  const { data: products = [], isLoading: productsLoading } = useOwnerProducts();
  const { data: bookings = [], isLoading: bookingsLoading } = useOwnerBookings();

  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDayBookings, setSelectedDayBookings] = useState<{ date: Date; bookings: any[] } | null>(null);
  const [modalBooking, setModalBooking] = useState<any | null>(null);

  // Filter bookings by selected product
  const filteredBookings = useMemo(() => {
    if (selectedProductId === 'all') return bookings;
    return bookings.filter((b: any) => {
      const pId = typeof b.product === 'object' ? b.product?._id : b.product;
      return String(pId) === String(selectedProductId);
    });
  }, [bookings, selectedProductId]);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days in current month
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { date: Date; isCurrentMonth: boolean; dayNumber: number }[] = [];

    // Prev month padding
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, totalDaysInPrevMonth - i),
        isCurrentMonth: false,
        dayNumber: totalDaysInPrevMonth - i,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
        dayNumber: i,
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
        dayNumber: i,
      });
    }

    return days;
  }, [year, month, firstDayOfMonth, totalDaysInMonth, totalDaysInPrevMonth]);

  // Map bookings to day dates
  const getBookingsForDay = (date: Date) => {
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime();

    return filteredBookings.filter((b: any) => {
      if (!b.startDate || !b.endDate) return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      // Overlaps if booking start <= dayEnd and booking end >= dayStart
      return bStart <= dayEnd && bEnd >= dayStart && b.status !== 'CANCELLED' && b.status !== 'REJECTED';
    });
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month stats
  const monthStats = useMemo(() => {
    const monthStart = new Date(year, month, 1).getTime();
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59).getTime();

    const activeInMonth = filteredBookings.filter((b: any) => {
      if (!b.startDate || !b.endDate) return false;
      const bStart = new Date(b.startDate).getTime();
      const bEnd = new Date(b.endDate).getTime();
      return bStart <= monthEnd && bEnd >= monthStart && b.status !== 'CANCELLED' && b.status !== 'REJECTED';
    });

    const totalRevenue = activeInMonth.reduce((sum: number, b: any) => {
      return sum + (Number(b.rentalAmount) || 0);
    }, 0);

    return {
      totalBookings: activeInMonth.length,
      revenue: totalRevenue,
    };
  }, [filteredBookings, year, month]);

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-in fade-in duration-500 min-h-screen">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-2">
            <CalendarDays className="h-3.5 w-3.5" /> Fleet Schedule
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Availability & Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Track rental reservations, pickup dates, and fleet availability in real time.
          </p>
        </div>

        {/* Filter by Product */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full h-11 px-3.5 bg-card border border-border rounded-xl text-foreground text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-primary shadow-xs"
            >
              <option value="all">All Listed Products ({products.length})</option>
              {products.map((p: any) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goToToday}
            className="h-11 px-4 rounded-xl border-border text-xs font-semibold shrink-0"
          >
            Today
          </Button>
        </div>
      </div>

      {/* ── METRICS STRIP ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Month Schedule
          </p>
          <p className="text-2xl font-bold text-foreground">
            {monthNames[month]} {year}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Bookings In Month
          </p>
          <p className="text-2xl font-bold text-foreground">
            {monthStats.totalBookings} reservation{monthStats.totalBookings === 1 ? '' : 's'}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border shadow-xs">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">
            Estimated Month Revenue
          </p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatCurrency(monthStats.revenue)}
          </p>
        </div>
      </div>

      {/* ── CALENDAR CONTROLS ── */}
      <div className="bg-card border border-border rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-foreground">
              {monthNames[month]} {year}
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground ml-4">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Active
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" /> Confirmed
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" /> Pending
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevMonth}
              className="rounded-xl h-9 w-9 border-border"
              title="Previous Month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="rounded-xl h-9 w-9 border-border"
              title="Next Month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── DAYS OF WEEK ── */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-center py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* ── CALENDAR GRID ── */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((item, index) => {
            const dayBookings = getBookingsForDay(item.date);
            const today = isToday(item.date);

            return (
              <div
                key={index}
                onClick={() => {
                  if (dayBookings.length > 0) {
                    setSelectedDayBookings({ date: item.date, bookings: dayBookings });
                  }
                }}
                className={`min-h-[100px] md:min-h-[120px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                  !item.isCurrentMonth
                    ? 'bg-secondary/20 border-border/40 opacity-40'
                    : today
                    ? 'bg-primary/5 border-primary shadow-xs'
                    : 'bg-card border-border hover:border-primary/40'
                } ${dayBookings.length > 0 ? 'cursor-pointer hover:bg-secondary/40' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className={`text-xs font-bold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                      today
                        ? 'bg-primary text-primary-foreground font-extrabold'
                        : 'text-foreground'
                    }`}
                  >
                    {item.dayNumber}
                  </span>
                  {dayBookings.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-secondary text-foreground">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayBookings.slice(0, 2).map((b: any) => {
                    const statusBg =
                      b.status === 'ACTIVE'
                        ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                        : b.status === 'CONFIRMED'
                        ? 'bg-blue-500/15 text-blue-800 dark:text-blue-300 border-blue-500/30'
                        : 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30';

                    return (
                      <div
                        key={b._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalBooking(b);
                        }}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md border truncate cursor-pointer hover:opacity-80 transition-opacity ${statusBg}`}
                        title={`${b.product?.name || 'Gear'}: ${b.status}`}
                      >
                        {b.product?.name || 'Rental'}
                      </div>
                    );
                  })}
                  {dayBookings.length > 2 && (
                    <p className="text-[9px] font-bold text-muted-foreground text-center">
                      +{dayBookings.length - 2} more
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SELECTED DAY BOOKINGS POPUP MODAL ── */}
      {selectedDayBookings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-card border border-border rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-foreground mb-1">
              Bookings for {formatDateDisplay(selectedDayBookings.date)}
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              {selectedDayBookings.bookings.length} reservation{selectedDayBookings.bookings.length === 1 ? '' : 's'} on this date.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {selectedDayBookings.bookings.map((b: any) => (
                <div
                  key={b._id}
                  className="p-4 rounded-2xl bg-secondary/30 border border-border flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{b.product?.name || 'Equipment'}</h4>
                    <p className="text-xs text-muted-foreground">
                      Renter: <strong className="text-foreground">{b.borrower?.fullName || 'Borrower'}</strong>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateDisplay(b.startDate)} - {formatDateDisplay(b.endDate)}
                    </p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary text-foreground uppercase">
                      {b.status}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedDayBookings(null);
                      setModalBooking(b);
                    }}
                    className="rounded-xl border-border text-xs"
                  >
                    View Details
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setSelectedDayBookings(null)}
                className="rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── BOOKING DETAIL MODAL ── */}
      {modalBooking && (
        <BookingDetailModal
          booking={modalBooking}
          isOpen={Boolean(modalBooking)}
          onClose={() => setModalBooking(null)}
          userRole="owner"
        />
      )}
    </div>
  );
}
