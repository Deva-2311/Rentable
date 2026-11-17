"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const rental_schema_1 = require("../rentals/schemas/rental.schema");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
const review_schema_1 = require("../reviews/schemas/review.schema");
const admin_auth_module_1 = require("./admin-auth/admin-auth.module");
const admin_users_module_1 = require("./admin-users/admin-users.module");
const admin_products_module_1 = require("./admin-products/admin-products.module");
const admin_finance_module_1 = require("./admin-finance/admin-finance.module");
const admin_trust_module_1 = require("./admin-trust/admin-trust.module");
const admin_analytics_module_1 = require("./admin-analytics/admin-analytics.module");
const admin_dashboard_controller_1 = require("./admin-dashboard.controller");
const rentals_module_1 = require("../rentals/rentals.module");
const bookings_module_1 = require("../bookings/bookings.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: rental_schema_1.Rental.name, schema: rental_schema_1.RentalSchema },
                { name: audit_log_schema_1.AuditLog.name, schema: audit_log_schema_1.AuditLogSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
            ]),
            rentals_module_1.RentalsModule,
            bookings_module_1.BookingsModule,
            admin_auth_module_1.AdminAuthModule,
            admin_users_module_1.AdminUsersModule,
            admin_products_module_1.AdminProductsModule,
            admin_finance_module_1.AdminFinanceModule,
            admin_trust_module_1.AdminTrustModule,
            admin_analytics_module_1.AdminAnalyticsModule,
        ],
        controllers: [admin_dashboard_controller_1.AdminDashboardController],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map