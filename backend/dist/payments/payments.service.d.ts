import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaymentDocument } from './schemas/payment.schema';
import { BookingsService } from '../bookings/bookings.service';
import { RentalsService } from '../rentals/rentals.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';
export declare class PaymentsService {
    private paymentModel;
    private bookingsService;
    private rentalsService;
    private configService;
    private razorpay;
    constructor(paymentModel: Model<PaymentDocument>, bookingsService: BookingsService, rentalsService: RentalsService, configService: ConfigService);
    createOrder(userId: string, createPaymentDto: CreatePaymentDto): Promise<{
        orderId: any;
        amount: number;
        currency: string;
        bookingId: import("mongoose").Types.ObjectId;
        isDemoMode: boolean;
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
    }>;
    simulatePayment(userId: string, simulateDto: {
        bookingId: string;
        amount?: number;
        simulationStatus?: string;
    }): Promise<{
        success: boolean;
        message: string;
        paymentId: import("mongoose").Types.ObjectId;
        bookingId: import("mongoose").Types.ObjectId;
        bookingRef: string;
    }>;
}
