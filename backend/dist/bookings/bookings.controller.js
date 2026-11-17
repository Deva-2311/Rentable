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
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const bookings_service_1 = require("./bookings.service");
const create_booking_dto_1 = require("./dto/create-booking.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const booking_schema_1 = require("./schemas/booking.schema");
let BookingsController = class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    async create(req, createBookingDto) {
        return {
            success: true,
            data: await this.bookingsService.create(String(req.user._id), createBookingDto),
        };
    }
    async findMyBookings(req) {
        return {
            success: true,
            data: await this.bookingsService.findByBorrower(String(req.user._id)),
        };
    }
    async findOwnerRequests(req) {
        return {
            success: true,
            data: await this.bookingsService.findByOwner(String(req.user._id)),
        };
    }
    async findOne(id) {
        return {
            success: true,
            data: await this.bookingsService.findById(id),
        };
    }
    async acceptBooking(req, id) {
        return {
            success: true,
            data: await this.bookingsService.updateStatus(id, booking_schema_1.BookingStatus.CONFIRMED, String(req.user._id), true),
        };
    }
    async rejectBooking(req, id) {
        return {
            success: true,
            data: await this.bookingsService.updateStatus(id, booking_schema_1.BookingStatus.REJECTED, String(req.user._id), true),
        };
    }
    async cancelBooking(req, id) {
        return {
            success: true,
            data: await this.bookingsService.cancelBooking(id, String(req.user._id)),
        };
    }
};
exports.BookingsController = BookingsController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER, role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new booking (Borrower only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_booking_dto_1.CreateBookingDto]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER, role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Get current borrower bookings' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findMyBookings", null);
__decorate([
    (0, common_1.Get)('owner/requests'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking requests for owner products' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOwnerRequests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Accept a booking request (Owner only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "acceptBooking", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a booking request (Owner only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "rejectBooking", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER),
    (0, swagger_1.ApiOperation)({
        summary: 'Cancel a booking (Borrower only, PENDING or CONFIRMED)',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "cancelBooking", null);
exports.BookingsController = BookingsController = __decorate([
    (0, swagger_1.ApiTags)('Bookings'),
    (0, common_1.Controller)('bookings'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [bookings_service_1.BookingsService])
], BookingsController);
//# sourceMappingURL=bookings.controller.js.map