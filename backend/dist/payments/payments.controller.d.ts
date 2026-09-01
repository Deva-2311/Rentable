import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: any, createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: {
            orderId: any;
            amount: number;
            currency: string;
            bookingId: import("mongoose").Types.ObjectId;
        };
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
