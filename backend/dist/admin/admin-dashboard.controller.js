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
exports.AdminDashboardController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../users/schemas/user.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const rental_schema_1 = require("../rentals/schemas/rental.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
const review_schema_1 = require("../reviews/schemas/review.schema");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const rentals_service_1 = require("../rentals/rentals.service");
const bookings_service_1 = require("../bookings/bookings.service");
const admin_operations_dto_1 = require("./dto/admin-operations.dto");
let AdminDashboardController = class AdminDashboardController {
    userModel;
    productModel;
    bookingModel;
    rentalModel;
    paymentModel;
    auditLogModel;
    reviewModel;
    rentalsService;
    bookingsService;
    constructor(userModel, productModel, bookingModel, rentalModel, paymentModel, auditLogModel, reviewModel, rentalsService, bookingsService) {
        this.userModel = userModel;
        this.productModel = productModel;
        this.bookingModel = bookingModel;
        this.rentalModel = rentalModel;
        this.paymentModel = paymentModel;
        this.auditLogModel = auditLogModel;
        this.reviewModel = reviewModel;
        this.rentalsService = rentalsService;
        this.bookingsService = bookingsService;
    }
    async getStats() {
        const totalUsers = await this.userModel.countDocuments();
        const totalProducts = await this.productModel.countDocuments();
        const totalBookings = await this.bookingModel.countDocuments();
        const activeRentals = await this.rentalModel.countDocuments({ status: rental_schema_1.RentalStatus.ACTIVE });
        const pendingBookings = await this.bookingModel.countDocuments({ status: booking_schema_1.BookingStatus.PENDING });
        const payments = await this.paymentModel.find({ status: payment_schema_1.PaymentState.SUCCESS });
        const totalRevenue = Math.round(payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100);
        const totalReviews = await this.reviewModel.countDocuments();
        const recentUsers = await this.userModel
            .find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(5);
        const recentBookings = await this.bookingModel
            .find()
            .populate('product', 'name images')
            .populate('borrower', 'fullName email')
            .sort({ createdAt: -1 })
            .limit(5);
        return {
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalBookings,
                activeRentals,
                pendingBookings,
                totalRevenue,
                totalPayments: payments.length,
                totalReviews,
                recentUsers,
                recentBookings,
            },
        };
    }
    async getUsers() {
        const users = await this.userModel.find().select('-password').sort({ createdAt: -1 });
        return { success: true, data: users };
    }
    async toggleUserStatus(id, action, req) {
        if (action !== 'activate' && action !== 'suspend') {
            throw new common_1.BadRequestException("Action must be either 'activate' or 'suspend'");
        }
        const targetUser = await this.userModel.findById(id);
        if (!targetUser) {
            throw new common_1.NotFoundException('User not found');
        }
        const currentAdminId = String(req.user._id);
        const targetUserId = String(targetUser._id);
        if (action === 'suspend' && currentAdminId === targetUserId) {
            throw new common_1.ForbiddenException('You cannot suspend your own administrative account');
        }
        if (action === 'suspend' &&
            (targetUser.role === role_enum_1.UserRole.ADMIN || targetUser.role === role_enum_1.UserRole.SUPER_ADMIN)) {
            const activeAdminCount = await this.userModel.countDocuments({
                role: { $in: [role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN] },
                isActive: true,
            });
            if (activeAdminCount <= 1) {
                throw new common_1.ForbiddenException('Cannot suspend the last active administrator');
            }
        }
        const isActive = action === 'activate';
        const previousState = { isActive: targetUser.isActive };
        targetUser.isActive = isActive;
        await targetUser.save();
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(currentAdminId),
            adminRole: req.user.role,
            action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
            targetType: 'User',
            targetId: targetUser._id,
            previousState,
            newState: { isActive },
            reason: `Admin requested account ${action}`,
        });
        return {
            success: true,
            message: `User ${action}d successfully`,
            data: { _id: targetUser._id, isActive: targetUser.isActive },
        };
    }
    async getProducts() {
        const products = await this.productModel
            .find()
            .populate('owner', 'fullName email')
            .populate('category', 'name slug')
            .sort({ createdAt: -1 });
        return { success: true, data: products };
    }
    async toggleProductAvailability(id, req) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const previousState = { availability: product.availability };
        product.availability = !product.availability;
        await product.save();
        const currentAdminId = String(req.user._id);
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(currentAdminId),
            adminRole: req.user.role,
            action: 'PRODUCT_AVAILABILITY_TOGGLED',
            targetType: 'Product',
            targetId: product._id,
            previousState,
            newState: { availability: product.availability },
        });
        return {
            success: true,
            message: `Product is now ${product.availability ? 'available' : 'hidden'} in catalog`,
            data: product,
        };
    }
    async updateProduct(id, dto, req) {
        const product = await this.productModel.findById(id);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const previousState = {
            pricePerDay: product.pricePerDay,
            securityDeposit: product.securityDeposit,
            status: product.status,
            availability: product.availability,
        };
        if (dto.name !== undefined)
            product.name = dto.name;
        if (dto.description !== undefined)
            product.description = dto.description;
        if (dto.pricePerDay !== undefined)
            product.pricePerDay = dto.pricePerDay;
        if (dto.securityDeposit !== undefined)
            product.securityDeposit = dto.securityDeposit;
        if (dto.availability !== undefined)
            product.availability = dto.availability;
        if (dto.status !== undefined)
            product.status = dto.status;
        await product.save();
        const currentAdminId = String(req.user._id);
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(currentAdminId),
            adminRole: req.user.role,
            action: 'PRODUCT_UPDATED',
            targetType: 'Product',
            targetId: product._id,
            previousState,
            newState: dto,
        });
        return {
            success: true,
            message: 'Product updated successfully',
            data: product,
        };
    }
    async getBookings() {
        const bookings = await this.bookingModel
            .find()
            .populate('product', 'name images pricePerDay securityDeposit location')
            .populate('borrower', 'fullName email phone')
            .populate('owner', 'fullName email phone')
            .sort({ createdAt: -1 });
        return { success: true, data: bookings };
    }
    async getBookingById(id) {
        const booking = await this.bookingModel
            .findById(id)
            .populate('product')
            .populate('borrower', 'fullName email phone')
            .populate('owner', 'fullName email phone');
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const bookingIdStr = String(booking._id);
        const payment = await this.paymentModel.findOne({ booking: bookingIdStr }).sort({ createdAt: -1 });
        const rental = await this.rentalModel.findOne({ booking: bookingIdStr });
        return {
            success: true,
            data: {
                booking,
                payment,
                rental,
            },
        };
    }
    async updateBookingStatus(id, dto, req) {
        const booking = await this.bookingModel.findById(id);
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const currentStatus = booking.status;
        const targetStatus = dto.status;
        if (currentStatus === targetStatus) {
            return { success: true, message: 'Status is already ' + targetStatus, data: booking };
        }
        if (currentStatus === booking_schema_1.BookingStatus.CANCELLED ||
            currentStatus === booking_schema_1.BookingStatus.COMPLETED ||
            currentStatus === booking_schema_1.BookingStatus.REJECTED) {
            throw new common_1.BadRequestException(`Cannot change status of a booking that is currently ${currentStatus}`);
        }
        const validTransitions = {
            [booking_schema_1.BookingStatus.PENDING]: [
                booking_schema_1.BookingStatus.CONFIRMED,
                booking_schema_1.BookingStatus.REJECTED,
                booking_schema_1.BookingStatus.CANCELLED,
            ],
            [booking_schema_1.BookingStatus.CONFIRMED]: [
                booking_schema_1.BookingStatus.ACTIVE,
                booking_schema_1.BookingStatus.CANCELLED,
            ],
            [booking_schema_1.BookingStatus.ACTIVE]: [
                booking_schema_1.BookingStatus.COMPLETED,
            ],
            [booking_schema_1.BookingStatus.REJECTED]: [],
            [booking_schema_1.BookingStatus.CANCELLED]: [],
            [booking_schema_1.BookingStatus.COMPLETED]: [],
            [booking_schema_1.BookingStatus.RETURNED]: [booking_schema_1.BookingStatus.COMPLETED],
        };
        const allowed = validTransitions[currentStatus] || [];
        if (!allowed.includes(targetStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition from ${currentStatus} to ${targetStatus}. Permitted: ${allowed.join(', ') || 'None'}`);
        }
        const previousState = { status: currentStatus };
        booking.status = targetStatus;
        const bookingIdStr = String(booking._id);
        if (targetStatus === booking_schema_1.BookingStatus.ACTIVE) {
            const existingRental = await this.rentalModel.findOne({ booking: bookingIdStr });
            if (!existingRental) {
                await this.rentalsService.createRental(bookingIdStr);
            }
        }
        else if (targetStatus === booking_schema_1.BookingStatus.COMPLETED) {
            await this.rentalModel.updateOne({ booking: bookingIdStr }, { status: rental_schema_1.RentalStatus.COMPLETED, completedAt: new Date() });
        }
        await booking.save();
        const currentAdminId = String(req.user._id);
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(currentAdminId),
            adminRole: req.user.role,
            action: 'BOOKING_STATUS_TRANSITION',
            targetType: 'Booking',
            targetId: booking._id,
            previousState,
            newState: { status: targetStatus },
            reason: dto.reason || 'Admin status transition',
        });
        return {
            success: true,
            message: `Booking status updated to ${targetStatus}`,
            data: booking,
        };
    }
    async getAuditLogs() {
        const logs = await this.auditLogModel
            .find()
            .populate('adminId', 'fullName email role')
            .sort({ createdAt: -1 })
            .limit(50);
        return { success: true, data: logs };
    }
    async getPayments() {
        const payments = await this.paymentModel
            .find()
            .populate('user', 'fullName email phone')
            .populate('booking', 'bookingId totalAmount status')
            .sort({ createdAt: -1 });
        return { success: true, data: payments };
    }
    async getReviews() {
        const reviews = await this.reviewModel
            .find()
            .populate('reviewer', 'fullName email')
            .populate('product', 'name images')
            .populate('booking', 'bookingId')
            .sort({ createdAt: -1 });
        return { success: true, data: reviews };
    }
    async deleteReview(id, req) {
        const review = await this.reviewModel.findById(id);
        if (!review)
            throw new common_1.NotFoundException('Review not found');
        const previousState = {
            product: review.product,
            booking: review.booking,
            reviewer: review.reviewer,
            rating: review.rating,
            comment: review.comment,
        };
        await this.reviewModel.findByIdAndDelete(id);
        const currentAdminId = String(req.user._id);
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(currentAdminId),
            adminRole: req.user.role,
            action: 'REVIEW_DELETED',
            targetType: 'Review',
            targetId: review._id,
            previousState,
            reason: 'Admin content moderation (violates platform guidelines or spam)',
        });
        return {
            success: true,
            message: 'Review deleted successfully',
            data: { _id: id },
        };
    }
};
exports.AdminDashboardController = AdminDashboardController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('users'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Patch)('users/:id/:action'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('action')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "toggleUserStatus", null);
__decorate([
    (0, common_1.Get)('products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getProducts", null);
__decorate([
    (0, common_1.Patch)('products/:id/toggle-availability'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "toggleProductAvailability", null);
__decorate([
    (0, common_1.Patch)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_operations_dto_1.AdminUpdateProductDto, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "updateProduct", null);
__decorate([
    (0, common_1.Get)('bookings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('bookings/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getBookingById", null);
__decorate([
    (0, common_1.Patch)('bookings/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_operations_dto_1.UpdateBookingStatusDto, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Get)('payments'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Delete)('reviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminDashboardController.prototype, "deleteReview", null);
exports.AdminDashboardController = AdminDashboardController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(3, (0, mongoose_1.InjectModel)(rental_schema_1.Rental.name)),
    __param(4, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(5, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __param(6, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        rentals_service_1.RentalsService,
        bookings_service_1.BookingsService])
], AdminDashboardController);
//# sourceMappingURL=admin-dashboard.controller.js.map