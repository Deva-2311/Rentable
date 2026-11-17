import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  Payment,
  PaymentDocument,
  PaymentState,
} from './schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { RentalsService } from '../rentals/rentals.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  BookingStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private bookingsService: BookingsService,
    private rentalsService: RentalsService,
    private configService: ConfigService,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID');
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (key_id && key_secret) {
      this.razorpay = new Razorpay({ key_id, key_secret });
    }
  }

  async createOrder(userId: string, createPaymentDto: CreatePaymentDto) {
    const booking = await this.bookingsService.findById(
      createPaymentDto.bookingId,
    );

    if (
      String((booking.borrower as any)._id || booking.borrower) !==
      String(userId)
    ) {
      throw new BadRequestException(
        'You are not the borrower for this booking',
      );
    }

    if (booking.paymentStatus === PaymentStatus.PAID || booking.status === BookingStatus.ACTIVE) {
      throw new BadRequestException(
        'This booking has already been paid for and is active',
      );
    }

    // Payment is initiated AFTER owner has accepted (CONFIRMED), or during checkout
    if (booking.status !== BookingStatus.CONFIRMED && booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Booking must be confirmed by the owner before payment can be made',
      );
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);

    // If Razorpay keys are not configured in environment, provide seamless Demo Mode order
    if (!this.razorpay) {
      const mockOrderId = `order_demo_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const payment = new this.paymentModel({
        booking: booking._id,
        user: userId,
        razorpayOrderId: mockOrderId,
        amount: amountInPaise,
        currency: 'INR',
        status: PaymentState.CREATED,
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
      status: PaymentState.CREATED,
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

  async verifyPayment(verifyDto: VerifyPaymentDto) {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');

    // Live mode cryptographic verification if secret is configured
    if (secret) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${verifyDto.razorpayOrderId}|${verifyDto.razorpayPaymentId}`)
        .digest('hex');

      if (generatedSignature !== verifyDto.razorpaySignature) {
        throw new BadRequestException(
          'Invalid payment signature. Payment rejected.',
        );
      }
    }

    const payment = await this.paymentModel.findOne({
      razorpayOrderId: verifyDto.razorpayOrderId,
    });
    if (!payment) throw new NotFoundException('Payment order not found');

    // Prevent duplicate verification
    if (payment.status === PaymentState.SUCCESS) {
      throw new BadRequestException('Payment has already been verified');
    }

    payment.razorpayPaymentId = verifyDto.razorpayPaymentId || `pay_demo_${Date.now()}`;
    payment.status = PaymentState.SUCCESS;
    await payment.save();

    // Update booking status to ACTIVE & PAID
    await this.bookingsService.internalUpdateStatus(
      payment.booking.toString(),
      BookingStatus.ACTIVE,
    );
    await this.bookingsService.internalUpdatePaymentStatus(
      payment.booking.toString(),
      PaymentStatus.PAID,
    );

    // Create the actual Rental document tracking the physical lifecycle if not existing
    const existingRentals = await this.rentalsService.getAllRentals(
      payment.user.toString(),
      false,
    );
    const rentalExists = existingRentals.some(
      (r) => String((r.booking as any)?._id || r.booking) === payment.booking.toString(),
    );
    if (!rentalExists) {
      await this.rentalsService.createRental(payment.booking.toString());
    }

    return {
      success: true,
      message: 'Payment verified successfully. Rental is now active.',
    };
  }

  async simulatePayment(
    userId: string,
    simulateDto: { bookingId: string; amount?: number; simulationStatus?: string },
  ) {
    const booking = await this.bookingsService.findById(simulateDto.bookingId);

    if (
      String((booking.borrower as any)._id || booking.borrower) !==
      String(userId)
    ) {
      throw new BadRequestException(
        'You are not the borrower for this booking',
      );
    }

    // Financial security: amount is strictly derived from the verified booking record on the server
    const amountInPaise = Math.round(booking.totalAmount * 100);

    if (simulateDto.simulationStatus === 'failed') {
      const payment = new this.paymentModel({
        booking: booking._id,
        user: userId,
        razorpayOrderId: `sim_order_fail_${Date.now()}`,
        razorpayPaymentId: `sim_pay_fail_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        status: PaymentState.FAILED,
      });
      await payment.save();

      await this.bookingsService.internalUpdatePaymentStatus(
        booking._id.toString(),
        PaymentStatus.FAILED,
      );

      throw new BadRequestException(
        'Simulated payment failure (Demo mode). Transaction was declined.',
      );
    }

    // Create a mock payment record
    const payment = new this.paymentModel({
      booking: booking._id,
      user: userId,
      razorpayOrderId: `sim_order_${Date.now()}`,
      razorpayPaymentId: `sim_pay_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      status: PaymentState.SUCCESS,
    });
    await payment.save();

    // Update booking status to ACTIVE
    await this.bookingsService.internalUpdateStatus(
      booking._id.toString(),
      BookingStatus.ACTIVE,
    );

    // Update booking payment status to PAID
    await this.bookingsService.internalUpdatePaymentStatus(
      booking._id.toString(),
      PaymentStatus.PAID,
    );

    // Create the actual Rental document tracking the physical lifecycle if not existing
    const existingRentals = await this.rentalsService.getAllRentals(
      userId,
      false,
    );
    const rentalExists = existingRentals.some(
      (r) => String((r.booking as any)?._id || r.booking) === booking._id.toString(),
    );
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
}
