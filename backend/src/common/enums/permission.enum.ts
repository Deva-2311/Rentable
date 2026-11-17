export enum Permission {
  // Users
  USERS_READ = 'users.read',
  USERS_UPDATE = 'users.update',
  USERS_SUSPEND = 'users.suspend',
  USERS_DELETE = 'users.delete',

  // Owners
  OWNERS_READ = 'owners.read',
  OWNERS_VERIFY = 'owners.verify',
  OWNERS_SUSPEND = 'owners.suspend',

  // Products
  PRODUCTS_READ = 'products.read',
  PRODUCTS_APPROVE = 'products.approve',
  PRODUCTS_REJECT = 'products.reject',
  PRODUCTS_FEATURE = 'products.feature',
  PRODUCTS_REMOVE = 'products.remove',

  // Bookings
  BOOKINGS_READ = 'bookings.read',
  BOOKINGS_UPDATE = 'bookings.update',
  BOOKINGS_CANCEL = 'bookings.cancel',

  // Payments / Finance
  PAYMENTS_READ = 'payments.read',
  PAYMENTS_REFUND = 'payments.refund',
  DEPOSITS_READ = 'deposits.read',
  DEPOSITS_RELEASE = 'deposits.release',
  DEPOSITS_DEDUCT = 'deposits.deduct',

  // Trust & Safety
  DISPUTES_READ = 'disputes.read',
  DISPUTES_RESOLVE = 'disputes.resolve',
  REPORTS_READ = 'reports.read',
  REPORTS_RESOLVE = 'reports.resolve',
  REVIEWS_READ = 'reviews.read',
  REVIEWS_MODERATE = 'reviews.moderate',

  // System / Growth
  ANALYTICS_READ = 'analytics.read',
  SETTINGS_MANAGE = 'settings.manage',
  AUDIT_LOGS_READ = 'audit_logs.read',
  ADMIN_USERS_MANAGE = 'admin_users.manage',
}

// Map default permissions to roles
import { UserRole } from './role.enum';

export const RolePermissions: Record<UserRole, Permission[]> = {
  [UserRole.BORROWER]: [],
  [UserRole.OWNER]: [],
  [UserRole.ADMIN]: Object.values(Permission), // Legacy admin gets all
  [UserRole.SUPER_ADMIN]: Object.values(Permission),
  [UserRole.OPERATIONS_ADMIN]: [
    Permission.USERS_READ,
    Permission.USERS_UPDATE,
    Permission.USERS_SUSPEND,
    Permission.OWNERS_READ,
    Permission.OWNERS_VERIFY,
    Permission.OWNERS_SUSPEND,
    Permission.PRODUCTS_READ,
    Permission.PRODUCTS_APPROVE,
    Permission.PRODUCTS_REJECT,
    Permission.PRODUCTS_FEATURE,
    Permission.PRODUCTS_REMOVE,
    Permission.BOOKINGS_READ,
    Permission.BOOKINGS_UPDATE,
    Permission.BOOKINGS_CANCEL,
    Permission.ANALYTICS_READ,
  ],
  [UserRole.FINANCE_ADMIN]: [
    Permission.PAYMENTS_READ,
    Permission.PAYMENTS_REFUND,
    Permission.DEPOSITS_READ,
    Permission.DEPOSITS_RELEASE,
    Permission.DEPOSITS_DEDUCT,
    Permission.BOOKINGS_READ,
    Permission.USERS_READ,
    Permission.OWNERS_READ,
    Permission.ANALYTICS_READ,
  ],
  [UserRole.SUPPORT_ADMIN]: [
    Permission.USERS_READ,
    Permission.OWNERS_READ,
    Permission.PRODUCTS_READ,
    Permission.BOOKINGS_READ,
    Permission.DISPUTES_READ,
    Permission.REPORTS_READ,
    Permission.REVIEWS_READ,
  ],
  [UserRole.CONTENT_MODERATOR]: [
    Permission.PRODUCTS_READ,
    Permission.PRODUCTS_APPROVE,
    Permission.PRODUCTS_REJECT,
    Permission.REVIEWS_READ,
    Permission.REVIEWS_MODERATE,
    Permission.REPORTS_READ,
    Permission.REPORTS_RESOLVE,
  ],
};
