export type ProductStatus = 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'REMOVED';

import { User } from './user';

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Product {
  _id: string;
  owner: User;
  name: string;
  slug: string;
  description: string;
  category: Category;
  images: string[];
  pricePerDay: number;
  securityDeposit: number;
  condition: string;
  location: string;
  availability: boolean;
  rentalRules?: string;
  cancellationPolicy?: string;
  status: ProductStatus;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}
