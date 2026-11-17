export type UserRole = 'borrower' | 'owner' | 'admin' | 'super_admin';

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
