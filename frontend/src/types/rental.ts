import { User } from './user';
import { Product } from './product';

export type RentalStatus = 'UPCOMING' | 'ACTIVE' | 'RETURN_REQUESTED' | 'RETURNED' | 'COMPLETED';

export interface Rental {
  _id: string;
  booking: any;
  borrower: User;
  owner: User;
  product: Product;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  returnRequestedAt?: string;
  returnedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}
