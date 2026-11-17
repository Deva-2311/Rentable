import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: AuthenticatedRequest, createBookingDto: CreateBookingDto): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    findMyBookings(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument[];
    }>;
    findOwnerRequests(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    acceptBooking(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    rejectBooking(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    cancelBooking(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
}
