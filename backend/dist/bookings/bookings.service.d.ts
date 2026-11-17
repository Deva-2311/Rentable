import { Model } from 'mongoose';
import { BookingDocument, BookingStatus, PaymentStatus } from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ProductsService } from '../products/products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class BookingsService {
    private bookingModel;
    private productsService;
    private notificationsGateway;
    constructor(bookingModel: Model<BookingDocument>, productsService: ProductsService, notificationsGateway: NotificationsGateway);
    create(borrowerId: string, createBookingDto: CreateBookingDto): Promise<BookingDocument>;
    findByBorrower(borrowerId: string): Promise<BookingDocument[]>;
    findByOwner(ownerId: string): Promise<BookingDocument[]>;
    findById(id: string): Promise<BookingDocument>;
    updateStatus(id: string, status: BookingStatus, userId: string, isOwner: boolean): Promise<BookingDocument>;
    internalUpdateStatus(id: string, status: BookingStatus): Promise<BookingDocument>;
    internalUpdatePaymentStatus(id: string, paymentStatus: PaymentStatus): Promise<BookingDocument>;
    cancelBooking(id: string, borrowerId: string): Promise<BookingDocument>;
}
