import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Payment, PaymentDocument, PaymentState } from './schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';
import * as crypto from 'crypto';
import Razorpay from 'razorpay';
import { BookingStatus, PaymentStatus } from '../bookings/schemas/booking.schema';

@Injectable()
export class PaymentsService {
  private razorpay: any;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private bookingsService: BookingsService,
    private configService: ConfigService,
  ) {
    const key_id = this.configService.get<string>('RAZORPAY_KEY_ID');
    const key_secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (key_id && key_secret) {
      this.razorpay = new Razorpay({ key_id, key_secret });
    }
  }

  async createOrder(userId: string, createPaymentDto: CreatePaymentDto) {
    const booking = await this.bookingsService.findById(createPaymentDto.bookingId);

    if (String((booking.borrower as any)._id || booking.borrower) !== String(userId)) {
      throw new BadRequestException('You are not the borrower for this booking');
    }

    // Payment is initiated AFTER owner has accepted (CONFIRMED), not on PENDING
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Booking must be confirmed by the owner before payment can be made',
      );
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);

    if (!this.razorpay) {
      throw new BadRequestException(
        'Payment gateway is not configured. Please contact support.',
      );
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
    };
  }

  async verifyPayment(verifyDto: VerifyPaymentDto) {
    const secret = this.configService.get<string>('RAZORPAY_KEY_SECRET');
    if (!secret) throw new BadRequestException('Payment gateway secret not configured');

    // Server-side signature verification — never trust frontend
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${verifyDto.razorpayOrderId}|${verifyDto.razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== verifyDto.razorpaySignature) {
      throw new BadRequestException('Invalid payment signature. Payment rejected.');
    }

    const payment = await this.paymentModel.findOne({
      razorpayOrderId: verifyDto.razorpayOrderId,
    });
    if (!payment) throw new NotFoundException('Payment order not found');

    // Prevent duplicate verification
    if (payment.status === PaymentState.SUCCESS) {
      throw new BadRequestException('Payment has already been verified');
    }

    payment.razorpayPaymentId = verifyDto.razorpayPaymentId;
    payment.status = PaymentState.SUCCESS;
    await payment.save();

    // Use the internal method to update booking status (bypasses ownership check)
    await this.bookingsService.internalUpdateStatus(
      payment.booking.toString(),
      BookingStatus.ACTIVE,
    );

    return { success: true, message: 'Payment verified successfully. Rental is now active.' };
  }
}
