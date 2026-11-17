import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Dispute, DisputeDocument, DisputeStatus } from './schemas/dispute.schema';
import { Booking, BookingDocument } from '../bookings/schemas/booking.schema';
import { CreateDisputeDto } from './dto/create-dispute.dto';
import { ResolveDisputeDto } from './dto/resolve-dispute.dto';

@Injectable()
export class DisputesService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<DisputeDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
  ) {}

  async create(
    userId: string,
    role: string,
    dto: CreateDisputeDto,
  ): Promise<DisputeDocument> {
    const bookingQuery = isValidObjectId(dto.bookingId)
      ? { $or: [{ _id: new Types.ObjectId(dto.bookingId) }, { bookingId: dto.bookingId }] }
      : { bookingId: dto.bookingId };

    const booking = await this.bookingModel.findOne(bookingQuery).exec();
    if (!booking) {
      throw new NotFoundException(`Booking with ID '${dto.bookingId}' not found`);
    }

    const borrowerStr = String((booking.borrower as any)?._id || booking.borrower);
    const ownerStr = String((booking.owner as any)?._id || booking.owner);
    const userStr = String(userId);

    const isParty = userStr === borrowerStr || userStr === ownerStr;
    const isAdmin = role === 'admin' || role === 'super_admin';

    if (!isParty && !isAdmin) {
      throw new ForbiddenException('You can only file disputes for your own bookings');
    }

    const openedById = new Types.ObjectId(userStr);
    const targetUserId =
      userStr === borrowerStr
        ? new Types.ObjectId(ownerStr)
        : new Types.ObjectId(borrowerStr);

    const dispute = new this.disputeModel({
      booking: booking._id,
      openedBy: openedById,
      targetUser: targetUserId,
      product: booking.product,
      reason: dto.reason,
      description: dto.description,
      status: DisputeStatus.OPENED,
      evidenceUrls: dto.evidenceUrls || [],
    });

    return dispute.save();
  }

  async findAll(userId: string, role: string): Promise<DisputeDocument[]> {
    const isAdmin = role === 'admin' || role === 'super_admin';

    const filter = isAdmin
      ? {}
      : {
          $or: [
            { openedBy: new Types.ObjectId(userId) },
            { targetUser: new Types.ObjectId(userId) },
          ],
        };

    return this.disputeModel
      .find(filter)
      .populate('product', 'name images pricePerDay')
      .populate('booking', 'bookingId startDate endDate rentalAmount')
      .populate('openedBy', 'fullName email role avatar')
      .populate('targetUser', 'fullName email role avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(
    id: string,
    userId: string,
    role: string,
  ): Promise<DisputeDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid dispute ID format');
    }

    const dispute = await this.disputeModel
      .findById(id)
      .populate('product', 'name images pricePerDay securityDeposit location')
      .populate('booking', 'bookingId startDate endDate rentalAmount duration')
      .populate('openedBy', 'fullName email role avatar')
      .populate('targetUser', 'fullName email role avatar')
      .exec();

    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    const isAdmin = role === 'admin' || role === 'super_admin';
    const isParty =
      String(dispute.openedBy?._id || dispute.openedBy) === String(userId) ||
      String(dispute.targetUser?._id || dispute.targetUser) === String(userId);

    if (!isAdmin && !isParty) {
      throw new ForbiddenException('You do not have permission to view this dispute');
    }

    return dispute;
  }

  async resolve(
    id: string,
    adminId: string,
    dto: ResolveDisputeDto,
  ): Promise<DisputeDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid dispute ID format');
    }

    const dispute = await this.disputeModel.findById(id).exec();
    if (!dispute) {
      throw new NotFoundException('Dispute not found');
    }

    dispute.status = DisputeStatus.RESOLVED;
    dispute.assignedAdmin = new Types.ObjectId(adminId);
    dispute.resolution = {
      action: dto.action,
      amount: dto.amount,
      reason: dto.reason,
      resolvedAt: new Date(),
      resolvedBy: new Types.ObjectId(adminId),
    };

    return dispute.save();
  }
}
