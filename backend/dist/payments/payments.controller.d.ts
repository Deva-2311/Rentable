import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VerifyPaymentDto, SimulatePaymentDto } from './dto/payment.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createOrder(req: AuthenticatedRequest, createPaymentDto: CreatePaymentDto): Promise<{
        success: boolean;
        data: {
            orderId: any;
            amount: number;
            currency: string;
            bookingId: import("mongoose").Types.ObjectId;
            isDemoMode: boolean;
        };
    }>;
    verifyPayment(verifyDto: VerifyPaymentDto): Promise<{
        success: boolean;
        message: string;
    }>;
    simulatePayment(req: AuthenticatedRequest, simulateDto: SimulatePaymentDto): Promise<{
        success: boolean;
        data: {
            success: boolean;
            message: string;
            paymentId: import("mongoose").Types.ObjectId;
            bookingId: import("mongoose").Types.ObjectId;
            bookingRef: string;
        };
    }>;
}
