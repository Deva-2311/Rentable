import { BookingStatus } from '../../bookings/schemas/booking.schema';
import { ProductStatus } from '../../products/schemas/product.schema';
export declare class UpdateBookingStatusDto {
    status: BookingStatus;
    reason?: string;
}
export declare class AdminUpdateProductDto {
    name?: string;
    description?: string;
    pricePerDay?: number;
    securityDeposit?: number;
    availability?: boolean;
    status?: ProductStatus;
}
