import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaymentDocument } from './schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';
export declare class PaymentsService {
    private paymentModel;
    private bookingsService;
    private configService;
    private razorpay;
    constructor(paymentModel: Model<PaymentDocument>, bookingsService: BookingsService, configService: ConfigService);
    createOrder(userId: string, createPaymentDto: CreatePaymentDto): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        bookingId: import("mongoose").Types.ObjectId;
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
