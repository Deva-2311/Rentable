export declare class CreatePaymentDto {
    bookingId: string;
}
export declare class VerifyPaymentDto {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
}
export declare class SimulatePaymentDto {
    bookingId: string;
    amount?: number;
    simulationStatus?: string;
}
