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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("./schemas/booking.schema");
const products_service_1 = require("../products/products.service");
const notifications_gateway_1 = require("../notifications/notifications.gateway");
let BookingsService = class BookingsService {
    bookingModel;
    productsService;
    notificationsGateway;
    constructor(bookingModel, productsService, notificationsGateway) {
        this.bookingModel = bookingModel;
        this.productsService = productsService;
        this.notificationsGateway = notificationsGateway;
    }
    async create(borrowerId, createBookingDto) {
        const product = await this.productsService.findById(createBookingDto.product);
        if (!product.availability) {
            throw new common_1.BadRequestException('Product is not currently available');
        }
        const start = new Date(createBookingDto.startDate);
        const end = new Date(createBookingDto.endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        if (end <= start) {
            throw new common_1.BadRequestException('End date must be after start date');
        }
        const productIdStr = String(product._id);
        const productQuery = (0, mongoose_2.isValidObjectId)(productIdStr)
            ? { $in: [new mongoose_2.Types.ObjectId(productIdStr), productIdStr] }
            : productIdStr;
        const overlapping = await this.bookingModel.findOne({
            product: productQuery,
            status: {
                $in: [
                    booking_schema_1.BookingStatus.PENDING,
                    booking_schema_1.BookingStatus.CONFIRMED,
                    booking_schema_1.BookingStatus.ACTIVE,
                ],
            },
            $or: [
                { startDate: { $lt: end, $gte: start } },
                { endDate: { $gt: start, $lte: end } },
                { startDate: { $lte: start }, endDate: { $gte: end } },
            ],
        });
        if (overlapping) {
            throw new common_1.BadRequestException('Product is already booked for the selected dates. Please choose different dates.');
        }
        const duration = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
        const rentalAmount = duration * product.pricePerDay;
        const platformFee = rentalAmount * 0.1;
        const totalAmount = rentalAmount + product.securityDeposit + platformFee;
        const bookingId = `BKG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
        const createdBooking = new this.bookingModel({
            bookingId,
            borrower: borrowerId,
            owner: product.owner,
            product: product._id,
            startDate: start,
            endDate: end,
            duration,
            rentalAmount,
            securityDeposit: product.securityDeposit,
            platformFee,
            totalAmount,
            status: booking_schema_1.BookingStatus.PENDING,
            paymentStatus: booking_schema_1.PaymentStatus.PENDING,
        });
        const saved = await createdBooking.save();
        this.notificationsGateway.notifyUser(String(product.owner), 'booking:new_request', {
            message: 'A new booking request has been received.',
            bookingId: saved._id,
            productName: product.name,
        });
        return saved;
    }
    async findByBorrower(borrowerId) {
        return this.bookingModel
            .find({ borrower: borrowerId })
            .populate('product', 'name images pricePerDay securityDeposit location condition')
            .populate('owner', 'fullName email phone avatar')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findByOwner(ownerId) {
        return this.bookingModel
            .find({ owner: ownerId })
            .populate('product', 'name images pricePerDay securityDeposit location condition')
            .populate('borrower', 'fullName email phone avatar')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findById(id) {
        const booking = await this.bookingModel
            .findById(id)
            .populate('product')
            .populate('borrower', 'fullName email phone avatar')
            .populate('owner', 'fullName email phone avatar')
            .exec();
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return booking;
    }
    async updateStatus(id, status, userId, isOwner) {
        const booking = await this.findById(id);
        if (isOwner) {
            const bookingOwnerId = String(booking.owner._id || booking.owner);
            const requestUserId = String(userId);
            if (bookingOwnerId !== requestUserId) {
                throw new common_1.UnauthorizedException('You do not own this product');
            }
        }
        if (booking.status !== booking_schema_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException(`Cannot change status of a booking that is currently ${booking.status}. It must be PENDING.`);
        }
        booking.status = status;
        const saved = await booking.save();
        const borrowerId = String(saved.borrower?._id || saved.borrower);
        const statusMessages = {
            [booking_schema_1.BookingStatus.CONFIRMED]: 'Your booking request has been accepted! Proceed to payment.',
            [booking_schema_1.BookingStatus.REJECTED]: 'Your booking request has been declined.',
        };
        const msg = statusMessages[status];
        if (msg) {
            this.notificationsGateway.notifyUser(borrowerId, 'booking:status_updated', {
                message: msg,
                bookingId: saved._id,
                status,
            });
        }
        return saved;
    }
    async internalUpdateStatus(id, status) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        booking.status = status;
        return booking.save();
    }
    async internalUpdatePaymentStatus(id, paymentStatus) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        booking.paymentStatus = paymentStatus;
        return booking.save();
    }
    async cancelBooking(id, borrowerId) {
        const booking = await this.findById(id);
        const borrowerIdStr = String(booking.borrower._id || booking.borrower);
        if (borrowerIdStr !== String(borrowerId)) {
            throw new common_1.UnauthorizedException('You can only cancel your own bookings');
        }
        const cancellableStatuses = [
            booking_schema_1.BookingStatus.PENDING,
            booking_schema_1.BookingStatus.CONFIRMED,
        ];
        if (!cancellableStatuses.includes(booking.status)) {
            throw new common_1.BadRequestException(`Cannot cancel a booking with status: ${booking.status}`);
        }
        booking.status = booking_schema_1.BookingStatus.CANCELLED;
        const saved = await booking.save();
        const ownerId = String(saved.owner?._id || saved.owner);
        this.notificationsGateway.notifyUser(ownerId, 'booking:status_updated', {
            message: 'A booking request for your product has been cancelled.',
            bookingId: saved._id,
            status: booking_schema_1.BookingStatus.CANCELLED,
        });
        return saved;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService,
        notifications_gateway_1.NotificationsGateway])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map