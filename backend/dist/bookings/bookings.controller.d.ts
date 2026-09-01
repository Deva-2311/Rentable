import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, createBookingDto: CreateBookingDto): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    findMyBookings(req: any): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument[];
    }>;
    findOwnerRequests(req: any): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument[];
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    acceptBooking(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    rejectBooking(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
    cancelBooking(req: any, id: string): Promise<{
        success: boolean;
        data: import("./schemas/booking.schema").BookingDocument;
    }>;
}
