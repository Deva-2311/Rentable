import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { PaymentDocument } from '../payments/schemas/payment.schema';
import { RentalDocument } from '../rentals/schemas/rental.schema';
export declare class AdminController {
    private userModel;
    private productModel;
    private bookingModel;
    private paymentModel;
    private rentalModel;
    constructor(userModel: Model<UserDocument>, productModel: Model<ProductDocument>, bookingModel: Model<BookingDocument>, paymentModel: Model<PaymentDocument>, rentalModel: Model<RentalDocument>);
    getStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalProducts: number;
            totalBookings: number;
            activeRentals: number;
            pendingBookings: number;
            totalRevenue: number;
            recentUsers: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: import("mongoose").Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            })[];
        };
    }>;
    getUsers(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    suspendUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    activateUser(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getBookings(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getProducts(): Promise<{
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
