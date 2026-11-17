import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { PaymentDocument } from '../payments/schemas/payment.schema';
import { RentalDocument } from '../rentals/schemas/rental.schema';
export declare class OwnerController {
    private productModel;
    private bookingModel;
    private paymentModel;
    private rentalModel;
    constructor(productModel: Model<ProductDocument>, bookingModel: Model<BookingDocument>, paymentModel: Model<PaymentDocument>, rentalModel: Model<RentalDocument>);
    getStats(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: {
            myProducts: number;
            pendingRequests: number;
            activeRentals: number;
            completedRentals: number;
            totalEarnings: any;
        };
    }>;
    getBookings(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getProducts(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
