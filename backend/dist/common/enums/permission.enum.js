"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = exports.Permission = void 0;
var Permission;
(function (Permission) {
    Permission["USERS_READ"] = "users.read";
    Permission["USERS_UPDATE"] = "users.update";
    Permission["USERS_SUSPEND"] = "users.suspend";
    Permission["USERS_DELETE"] = "users.delete";
    Permission["OWNERS_READ"] = "owners.read";
    Permission["OWNERS_VERIFY"] = "owners.verify";
    Permission["OWNERS_SUSPEND"] = "owners.suspend";
    Permission["PRODUCTS_READ"] = "products.read";
    Permission["PRODUCTS_APPROVE"] = "products.approve";
    Permission["PRODUCTS_REJECT"] = "products.reject";
    Permission["PRODUCTS_FEATURE"] = "products.feature";
    Permission["PRODUCTS_REMOVE"] = "products.remove";
    Permission["BOOKINGS_READ"] = "bookings.read";
    Permission["BOOKINGS_UPDATE"] = "bookings.update";
    Permission["BOOKINGS_CANCEL"] = "bookings.cancel";
    Permission["PAYMENTS_READ"] = "payments.read";
    Permission["PAYMENTS_REFUND"] = "payments.refund";
    Permission["DEPOSITS_READ"] = "deposits.read";
    Permission["DEPOSITS_RELEASE"] = "deposits.release";
    Permission["DEPOSITS_DEDUCT"] = "deposits.deduct";
    Permission["DISPUTES_READ"] = "disputes.read";
    Permission["DISPUTES_RESOLVE"] = "disputes.resolve";
    Permission["REPORTS_READ"] = "reports.read";
    Permission["REPORTS_RESOLVE"] = "reports.resolve";
    Permission["REVIEWS_READ"] = "reviews.read";
    Permission["REVIEWS_MODERATE"] = "reviews.moderate";
    Permission["ANALYTICS_READ"] = "analytics.read";
    Permission["SETTINGS_MANAGE"] = "settings.manage";
    Permission["AUDIT_LOGS_READ"] = "audit_logs.read";
    Permission["ADMIN_USERS_MANAGE"] = "admin_users.manage";
})(Permission || (exports.Permission = Permission = {}));
const role_enum_1 = require("./role.enum");
exports.RolePermissions = {
    [role_enum_1.UserRole.BORROWER]: [],
    [role_enum_1.UserRole.OWNER]: [],
    [role_enum_1.UserRole.ADMIN]: Object.values(Permission),
    [role_enum_1.UserRole.SUPER_ADMIN]: Object.values(Permission),
    [role_enum_1.UserRole.OPERATIONS_ADMIN]: [
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
    [role_enum_1.UserRole.FINANCE_ADMIN]: [
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
    [role_enum_1.UserRole.SUPPORT_ADMIN]: [
        Permission.USERS_READ,
        Permission.OWNERS_READ,
        Permission.PRODUCTS_READ,
        Permission.BOOKINGS_READ,
        Permission.DISPUTES_READ,
        Permission.REPORTS_READ,
        Permission.REVIEWS_READ,
    ],
    [role_enum_1.UserRole.CONTENT_MODERATOR]: [
        Permission.PRODUCTS_READ,
        Permission.PRODUCTS_APPROVE,
        Permission.PRODUCTS_REJECT,
        Permission.REVIEWS_READ,
        Permission.REVIEWS_MODERATE,
        Permission.REPORTS_READ,
        Permission.REPORTS_RESOLVE,
    ],
};
//# sourceMappingURL=permission.enum.js.map