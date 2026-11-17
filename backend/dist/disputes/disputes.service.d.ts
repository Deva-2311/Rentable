import { Model } from 'mongoose';
import { DisputeDocument } from './schemas/dispute.schema';
import { BookingDocument } from '../bookings/schemas/booking.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';
export declare class DisputesService {
    private disputeModel;
    private bookingModel;
    constructor(disputeModel: Model<DisputeDocument>, bookingModel: Model<BookingDocument>);
    create(userId: string, role: string, dto: CreateDisputeDto): Promise<DisputeDocument>;
    findAll(userId: string, role: string): Promise<DisputeDocument[]>;
    findOne(id: string, userId: string, role: string): Promise<DisputeDocument>;
    resolve(id: string, adminId: string, dto: ResolveDisputeDto): Promise<DisputeDocument>;
}
