export enum UserRole {
  BORROWER = 'borrower',
  OWNER = 'owner',
  ADMIN = 'admin', // Legacy admin, migrating to SUPER_ADMIN
  SUPER_ADMIN = 'super_admin',
  OPERATIONS_ADMIN = 'operations_admin',
  FINANCE_ADMIN = 'finance_admin',
  SUPPORT_ADMIN = 'support_admin',
  CONTENT_MODERATOR = 'content_moderator',
}
