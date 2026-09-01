import { Model } from 'mongoose';
import { RentalDocument } from './schemas/rental.schema';
export declare class RentalsService {
    private rentalModel;
    constructor(rentalModel: Model<RentalDocument>);
    getActiveRentals(userId: string, isOwner: boolean): Promise<RentalDocument[]>;
    getHistory(userId: string, isOwner: boolean): Promise<RentalDocument[]>;
    findById(id: string): Promise<RentalDocument>;
    requestReturn(id: string, borrowerId: string): Promise<RentalDocument>;
    completeRental(id: string, ownerId: string): Promise<RentalDocument>;
}
