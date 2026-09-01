import { Model } from 'mongoose';
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
    getStats(req: any): Promise<{
        success: boolean;
        data: {
            myProducts: number;
            pendingRequests: number;
            activeRentals: number;
            completedRentals: number;
            totalEarnings: number;
        };
    }>;
    getBookings(req: any): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getProducts(req: any): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
}
