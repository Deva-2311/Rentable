"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const config_1 = require("@nestjs/config");
const payment_schema_1 = require("./schemas/payment.schema");
const bookings_service_1 = require("../bookings/bookings.service");
const rentals_service_1 = require("../rentals/rentals.service");
const crypto = __importStar(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const booking_schema_1 = require("../bookings/schemas/booking.schema");
let PaymentsService = class PaymentsService {
    paymentModel;
    bookingsService;
    rentalsService;
    configService;
    razorpay;
    constructor(paymentModel, bookingsService, rentalsService, configService) {
        this.paymentModel = paymentModel;
        this.bookingsService = bookingsService;
        this.rentalsService = rentalsService;
        this.configService = configService;
        const key_id = this.configService.get('RAZORPAY_KEY_ID');
        const key_secret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (key_id && key_secret) {
            this.razorpay = new razorpay_1.default({ key_id, key_secret });
        }
    }
    async createOrder(userId, createPaymentDto) {
        const booking = await this.bookingsService.findById(createPaymentDto.bookingId);
        if (String(booking.borrower._id || booking.borrower) !==
            String(userId)) {
            throw new common_1.BadRequestException('You are not the borrower for this booking');
        }
        if (booking.paymentStatus === booking_schema_1.PaymentStatus.PAID || booking.status === booking_schema_1.BookingStatus.ACTIVE) {
            throw new common_1.BadRequestException('This booking has already been paid for and is active');
        }
        if (booking.status !== booking_schema_1.BookingStatus.CONFIRMED && booking.status !== booking_schema_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Booking must be confirmed by the owner before payment can be made');
        }
        const amountInPaise = Math.round(booking.totalAmount * 100);
        if (!this.razorpay) {
            const mockOrderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
            const payment = new this.paymentModel({
                booking: booking._id,
                user: userId,
                razorpayOrderId: mockOrderId,
                amount: amountInPaise,
                currency: 'INR',
                status: payment_schema_1.PaymentState.CREATED,
            });
            await payment.save();
            return {
                orderId: mockOrderId,
                amount: amountInPaise,
                currency: 'INR',
                bookingId: booking._id,
                isDemoMode: true,
            };
        }
        const order = await this.razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: booking._id.toString(),
        });
        const payment = new this.paymentModel({
            booking: booking._id,
            user: userId,
            razorpayOrderId: order.id,
            amount: amountInPaise,
            currency: 'INR',
            status: payment_schema_1.PaymentState.CREATED,
        });
        await payment.save();
        return {
            orderId: order.id,
            amount: amountInPaise,
            currency: 'INR',
            bookingId: booking._id,
            isDemoMode: false,
        };
    }
    async verifyPayment(verifyDto) {
        const secret = this.configService.get('RAZORPAY_KEY_SECRET');
        if (secret) {
            const generatedSignature = crypto
                .createHmac('sha256', secret)
                .update(`${verifyDto.razorpayOrderId}|${verifyDto.razorpayPaymentId}`)
                .digest('hex');
            if (generatedSignature !== verifyDto.razorpaySignature) {
                throw new common_1.BadRequestException('Invalid payment signature. Payment rejected.');
            }
        }
        const payment = await this.paymentModel.findOne({
            razorpayOrderId: verifyDto.razorpayOrderId,
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment order not found');
        if (payment.status === payment_schema_1.PaymentState.SUCCESS) {
            throw new common_1.BadRequestException('Payment has already been verified');
        }
        payment.razorpayPaymentId = verifyDto.razorpayPaymentId || `pay_demo_${Date.now()}`;
        payment.status = payment_schema_1.PaymentState.SUCCESS;
        await payment.save();
        await this.bookingsService.internalUpdateStatus(payment.booking.toString(), booking_schema_1.BookingStatus.ACTIVE);
        await this.bookingsService.internalUpdatePaymentStatus(payment.booking.toString(), booking_schema_1.PaymentStatus.PAID);
        const existingRentals = await this.rentalsService.getAllRentals(payment.user.toString(), false);
        const rentalExists = existingRentals.some((r) => String(r.booking?._id || r.booking) === payment.booking.toString());
        if (!rentalExists) {
            await this.rentalsService.createRental(payment.booking.toString());
        }
        return {
            success: true,
            message: 'Payment verified successfully. Rental is now active.',
        };
    }
    async simulatePayment(userId, simulateDto) {
        const booking = await this.bookingsService.findById(simulateDto.bookingId);
        if (String(booking.borrower._id || booking.borrower) !==
            String(userId)) {
            throw new common_1.BadRequestException('You are not the borrower for this booking');
        }
        const amountInPaise = Math.round(booking.totalAmount * 100);
        if (simulateDto.simulationStatus === 'failed') {
            const payment = new this.paymentModel({
                booking: booking._id,
                user: userId,
                razorpayOrderId: `sim_order_fail_${Date.now()}`,
                razorpayPaymentId: `sim_pay_fail_${Date.now()}`,
                amount: amountInPaise,
                currency: 'INR',
                status: payment_schema_1.PaymentState.FAILED,
            });
            await payment.save();
            await this.bookingsService.internalUpdatePaymentStatus(booking._id.toString(), booking_schema_1.PaymentStatus.FAILED);
            throw new common_1.BadRequestException('Simulated payment failure (Demo mode). Transaction was declined.');
        }
        const payment = new this.paymentModel({
            booking: booking._id,
            user: userId,
            razorpayOrderId: `sim_order_${Date.now()}`,
            razorpayPaymentId: `sim_pay_${Date.now()}`,
            amount: amountInPaise,
            currency: 'INR',
            status: payment_schema_1.PaymentState.SUCCESS,
        });
        await payment.save();
        await this.bookingsService.internalUpdateStatus(booking._id.toString(), booking_schema_1.BookingStatus.ACTIVE);
        await this.bookingsService.internalUpdatePaymentStatus(booking._id.toString(), booking_schema_1.PaymentStatus.PAID);
        const existingRentals = await this.rentalsService.getAllRentals(userId, false);
        const rentalExists = existingRentals.some((r) => String(r.booking?._id || r.booking) === booking._id.toString());
        if (!rentalExists) {
            await this.rentalsService.createRental(booking._id.toString());
        }
        return {
            success: true,
            message: 'Simulated payment successful. Rental is now active.',
            paymentId: payment._id,
            bookingId: booking._id,
            bookingRef: booking.bookingId,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(payment_schema_1.Payment.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bookings_service_1.BookingsService,
        rentals_service_1.RentalsService,
        config_1.ConfigService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map