export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'CANCELLED' | 'ACTIVE' | 'COMPLETED' | 'RETURNED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

import { User } from './user';
import { Product } from './product';

export interface Booking {
  _id: string;
  bookingId: string;
  borrower: User;
  owner: User;
  product: Product;
  startDate: string;
  endDate: string;
  duration: number;
  rentalAmount: number;
  securityDeposit: number;
  platformFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}
