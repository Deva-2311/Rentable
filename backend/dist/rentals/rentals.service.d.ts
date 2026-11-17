import { Model } from 'mongoose';
import { RentalDocument } from './schemas/rental.schema';
import { BookingsService } from '../bookings/bookings.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
export declare class RentalsService {
    private rentalModel;
    private bookingsService;
    private notificationsGateway;
    constructor(rentalModel: Model<RentalDocument>, bookingsService: BookingsService, notificationsGateway: NotificationsGateway);
    createRental(bookingId: string): Promise<RentalDocument>;
    getAllRentals(userId: string, isOwner: boolean): Promise<RentalDocument[]>;
    getActiveRentals(userId: string, isOwner: boolean): Promise<RentalDocument[]>;
    getHistory(userId: string, isOwner: boolean): Promise<RentalDocument[]>;
    findById(id: string): Promise<RentalDocument>;
    requestReturn(id: string, borrowerId: string): Promise<RentalDocument>;
    completeRental(id: string, ownerId: string): Promise<RentalDocument>;
}
