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
exports.OwnerController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const product_schema_1 = require("../products/schemas/product.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const payment_schema_1 = require("../payments/schemas/payment.schema");
const rental_schema_1 = require("../rentals/schemas/rental.schema");
let OwnerController = class OwnerController {
    productModel;
    bookingModel;
    paymentModel;
    rentalModel;
    constructor(productModel, bookingModel, paymentModel, rentalModel) {
        this.productModel = productModel;
        this.bookingModel = bookingModel;
        this.paymentModel = paymentModel;
        this.rentalModel = rentalModel;
    }
    async getStats(req) {
        const ownerIdStr = String(req.user._id);
        const ownerObjId = (0, mongoose_2.isValidObjectId)(ownerIdStr) ? new mongoose_2.Types.ObjectId(ownerIdStr) : null;
        const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };
        const [myProducts, pendingRequests, activeRentals, completedRentals, earningsResult,] = await Promise.all([
            this.productModel.countDocuments(ownerFilter),
            this.bookingModel.countDocuments({
                ...ownerFilter,
                status: booking_schema_1.BookingStatus.PENDING,
            }),
            this.rentalModel.countDocuments({
                ...ownerFilter,
                status: rental_schema_1.RentalStatus.ACTIVE,
            }),
            this.rentalModel.countDocuments({
                ...ownerFilter,
                status: rental_schema_1.RentalStatus.COMPLETED,
            }),
            this.bookingModel.aggregate([
                {
                    $match: {
                        ...(ownerObjId
                            ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] }
                            : { owner: ownerIdStr }),
                        paymentStatus: booking_schema_1.PaymentStatus.PAID,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$rentalAmount' },
                    },
                },
            ]),
        ]);
        const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;
        return {
            success: true,
            data: {
                myProducts,
                pendingRequests,
                activeRentals,
                completedRentals,
                totalEarnings,
            },
        };
    }
    async getBookings(req) {
        const ownerIdStr = String(req.user._id);
        const ownerObjId = (0, mongoose_2.isValidObjectId)(ownerIdStr) ? new mongoose_2.Types.ObjectId(ownerIdStr) : null;
        const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };
        const bookings = await this.bookingModel
            .find(ownerFilter)
            .populate('product', 'name images pricePerDay securityDeposit location condition')
            .populate('borrower', 'fullName email phone avatar')
            .sort({ createdAt: -1 })
            .exec();
        return { success: true, data: bookings };
    }
    async getProducts(req) {
        const ownerIdStr = String(req.user._id);
        const ownerObjId = (0, mongoose_2.isValidObjectId)(ownerIdStr) ? new mongoose_2.Types.ObjectId(ownerIdStr) : null;
        const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };
        const products = await this.productModel
            .find(ownerFilter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .exec();
        return { success: true, data: products };
    }
};
exports.OwnerController = OwnerController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get owner statistics (Owner only)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('bookings'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all booking requests for owner products' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)('products'),
    (0, swagger_1.ApiOperation)({ summary: 'Get owner product listings' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerController.prototype, "getProducts", null);
exports.OwnerController = OwnerController = __decorate([
    (0, swagger_1.ApiTags)('Owner Dashboard'),
    (0, common_1.Controller)('owner'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OWNER, role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(2, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __param(3, (0, mongoose_1.InjectModel)(rental_schema_1.Rental.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], OwnerController);
//# sourceMappingURL=owner.controller.js.map