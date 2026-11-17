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
exports.RentalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rental_schema_1 = require("./schemas/rental.schema");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let RentalsService = class RentalsService {
    rentalModel;
    bookingsService;
    notificationsGateway;
    constructor(rentalModel, bookingsService, notificationsGateway) {
        this.rentalModel = rentalModel;
        this.bookingsService = bookingsService;
        this.notificationsGateway = notificationsGateway;
    }
    async createRental(bookingId) {
        const booking = await this.bookingsService.findById(bookingId);
        const rental = new this.rentalModel({
            booking: booking._id,
            product: booking.product,
            borrower: booking.borrower,
            owner: booking.owner,
            startDate: booking.startDate,
            endDate: booking.endDate,
            status: rental_schema_1.RentalStatus.ACTIVE,
        });
        const saved = await rental.save();
        const borrowerId = String(booking.borrower?._id || booking.borrower);
        const ownerId = String(booking.owner?._id || booking.owner);
        this.notificationsGateway.notifyUser(borrowerId, 'rental:active', {
            message: 'Payment confirmed! Your rental is now active.',
            rentalId: saved._id,
        });
        this.notificationsGateway.notifyUser(ownerId, 'rental:active', {
            message: 'Payment received. A rental for your product is now active.',
            rentalId: saved._id,
        });
        return saved;
    }
    async getAllRentals(userId, isOwner) {
        const filter = isOwner ? { owner: userId } : { borrower: userId };
        return this.rentalModel
            .find(filter)
            .populate('product')
            .populate('owner', 'fullName email phone avatar')
            .populate('borrower', 'fullName email phone avatar')
            .populate('booking')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getActiveRentals(userId, isOwner) {
        const filter = isOwner ? { owner: userId } : { borrower: userId };
        return this.rentalModel
            .find({
            ...filter,
            status: {
                $in: [rental_schema_1.RentalStatus.ACTIVE, rental_schema_1.RentalStatus.RETURN_REQUESTED],
            },
        })
            .populate('product')
            .populate('owner', 'fullName email phone avatar')
            .populate('borrower', 'fullName email phone avatar')
            .populate('booking')
            .sort({ createdAt: -1 })
            .exec();
    }
    async getHistory(userId, isOwner) {
        const filter = isOwner ? { owner: userId } : { borrower: userId };
        return this.rentalModel
            .find({
            ...filter,
            status: { $in: [rental_schema_1.RentalStatus.RETURNED, rental_schema_1.RentalStatus.COMPLETED] },
        })
            .populate('product')
            .populate('owner', 'fullName email phone avatar')
            .populate('borrower', 'fullName email phone avatar')
            .populate('booking')
            .sort({ completedAt: -1, updatedAt: -1, createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const rental = await this.rentalModel
            .findById(id)
            .populate('product booking borrower owner')
            .exec();
        if (!rental) {
            throw new common_1.NotFoundException('Rental not found');
        }
        return rental;
    }
    async requestReturn(id, borrowerId) {
        const rental = await this.findById(id);
        if (String(rental.borrower._id || rental.borrower) !==
            String(borrowerId)) {
            throw new common_1.UnauthorizedException('You do not own this rental');
        }
        if (rental.status !== rental_schema_1.RentalStatus.ACTIVE) {
            throw new common_1.BadRequestException('Rental is not currently active');
        }
        rental.status = rental_schema_1.RentalStatus.RETURN_REQUESTED;
        rental.returnRequestedAt = new Date();
        const saved = await rental.save();
        const ownerId = String(saved.owner?._id || saved.owner);
        this.notificationsGateway.notifyUser(ownerId, 'rental:return_requested', {
            message: 'A borrower has requested to return a product. Please confirm the return.',
            rentalId: saved._id,
            productName: saved.product?.name,
        });
        return saved;
    }
    async completeRental(id, ownerId) {
        const rental = await this.findById(id);
        if (String(rental.owner._id || rental.owner) !== String(ownerId)) {
            throw new common_1.UnauthorizedException('You do not own the product for this rental');
        }
        if (rental.status !== rental_schema_1.RentalStatus.RETURN_REQUESTED &&
            rental.status !== rental_schema_1.RentalStatus.RETURNED) {
            throw new common_1.BadRequestException('Borrower has not requested a return yet');
        }
        rental.status = rental_schema_1.RentalStatus.COMPLETED;
        rental.completedAt = new Date();
        await rental.save();
        await this.bookingsService.internalUpdateStatus(String(rental.booking._id || rental.booking), booking_schema_1.BookingStatus.COMPLETED);
        const borrowerId = String(rental.borrower?._id || rental.borrower);
        this.notificationsGateway.notifyUser(borrowerId, 'rental:completed', {
            message: 'Your rental has been completed. Thank you for using Rentable!',
            rentalId: rental._id,
        });
        return rental;
    }
};
exports.RentalsService = RentalsService;
exports.RentalsService = RentalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(rental_schema_1.Rental.name)),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => bookings_service_1.BookingsService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bookings_service_1.BookingsService,
        notifications_gateway_1.NotificationsGateway])
], RentalsService);
//# sourceMappingURL=rentals.service.js.map