"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const user_schema_1 = require("../users/schemas/user.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const rental_schema_1 = require("../rentals/schemas/rental.schema");
let AdminController = class AdminController {
    userModel;
    productModel;
    bookingModel;
    paymentModel;
    rentalModel;
    constructor(userModel, productModel, bookingModel, paymentModel, rentalModel) {
        this.userModel = userModel;
        this.productModel = productModel;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.rentalModel = rentalModel;
    }
    async getStats() {
        const [totalUsers, totalProducts, totalBookings, activeRentals, revenueResult, pendingBookings, recentUsers,] = await Promise.all([
            this.userModel.countDocuments({}),
            this.productModel.countDocuments({}),
            this.bookingModel.countDocuments({}),
            this.rentalModel.countDocuments({ status: rental_schema_1.RentalStatus.ACTIVE }),
            this.paymentModel.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } },
            ]),
            this.bookingModel.countDocuments({ status: booking_schema_1.BookingStatus.PENDING }),
            this.userModel
                .find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .select('fullName email role createdAt')
                .exec(),
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total / 100 : 0;
        return {
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalBookings,
                activeRentals,
                pendingBookings,
                totalRevenue,
                recentUsers,
            },
        };
    }
    async getUsers() {
        const users = await this.userModel
            .find({})
            .select('-password')
            .sort({ createdAt: -1 })
            .exec();
        return { success: true, data: users };
    }
    async suspendUser(id) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        if (user.role === role_enum_1.UserRole.ADMIN)
            throw new common_1.BadRequestException('Cannot suspend another admin');
        user.isActive = false;
        await user.save();
        return { success: true, message: 'User suspended successfully' };
    }
    async activateUser(id) {
        const user = await this.userModel.findById(id);
        if (!user)
            throw new common_1.BadRequestException('User not found');
        user.isActive = true;
        await user.save();
        return { success: true, message: 'User activated successfully' };
    }
    async getBookings() {
        const bookings = await this.bookingModel
            .find({})
            .populate('product borrower owner', 'name fullName email')
            .sort({ createdAt: -1 })
            .exec();
        return { success: true, data: bookings };
    }
    async getProducts() {
        const products = await this.productModel
            .find({})
            .populate('owner', 'fullName email')
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .exec();
        return { success: true, data: products };
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get overall platform statistics (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all users (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/suspend'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend a user (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendUser", null);
__decorate([
    (0, common_1.Patch)('users/:id/activate'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate a user (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "activateUser", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all bookings (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all products (Admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProducts", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin Dashboard'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(3, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(4, (0, mongoose_1.InjectModel)(rental_schema_1.Rental.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], AdminController);
//# sourceMappingURL=admin.controller.js.map