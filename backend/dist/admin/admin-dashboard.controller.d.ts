import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { Rental, RentalDocument } from '../rentals/schemas/rental.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { AuditLog, AuditLogDocument } from '../audit/schemas/audit-log.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { RentalsService } from '../rentals/rentals.service';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBookingStatusDto, AdminUpdateProductDto } from './dto/admin-operations.dto';
export declare class AdminDashboardController {
    private userModel;
    private productModel;
    private bookingModel;
    private rentalModel;
    private paymentModel;
    private auditLogModel;
    private reviewModel;
    private rentalsService;
    private bookingsService;
    constructor(userModel: Model<UserDocument>, productModel: Model<ProductDocument>, bookingModel: Model<BookingDocument>, rentalModel: Model<RentalDocument>, paymentModel: Model<PaymentDocument>, auditLogModel: Model<AuditLogDocument>, reviewModel: Model<ReviewDocument>, rentalsService: RentalsService, bookingsService: BookingsService);
    getStats(): Promise<{
        success: boolean;
        data: {
            totalUsers: number;
            totalProducts: number;
            totalBookings: number;
            activeRentals: number;
            pendingBookings: number;
            totalRevenue: number;
            totalPayments: number;
            totalReviews: number;
            recentUsers: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            })[];
            recentBookings: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            })[];
        };
    }>;
    getUsers(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, UserDocument, {}, import("mongoose").DefaultSchemaOptions> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    toggleUserStatus(id: string, action: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            _id: Types.ObjectId;
            isActive: boolean;
        };
    }>;
    getProducts(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    toggleProductAvailability(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    updateProduct(id: string, dto: AdminUpdateProductDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getBookings(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getBookingById(id: string): Promise<{
        success: boolean;
        data: {
            booking: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
            payment: import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
            rental: import("mongoose").Document<unknown, {}, RentalDocument, {}, import("mongoose").DefaultSchemaOptions> & Rental & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
                _id: Types.ObjectId;
            }> & {
                __v: number;
            } & {
                id: string;
            };
        };
    }>;
    updateBookingStatus(id: string, dto: UpdateBookingStatusDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, BookingDocument, {}, import("mongoose").DefaultSchemaOptions> & Booking & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    getAuditLogs(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, AuditLogDocument, {}, import("mongoose").DefaultSchemaOptions> & AuditLog & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getPayments(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, PaymentDocument, {}, import("mongoose").DefaultSchemaOptions> & Payment & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    getReviews(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, ReviewDocument, {}, import("mongoose").DefaultSchemaOptions> & Review & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    deleteReview(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
        data: {
            _id: string;
        };
    }>;
}
