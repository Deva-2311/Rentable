import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental, RentalDocument, RentalStatus } from './schemas/rental.schema';

@Injectable()
export class RentalsService {
  constructor(
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
  ) {}

  async getActiveRentals(userId: string, isOwner: boolean): Promise<RentalDocument[]> {
    const filter = isOwner ? { owner: userId } : { borrower: userId };
    return this.rentalModel.find({ ...filter, status: RentalStatus.ACTIVE }).populate('product').exec();
  }

  async getHistory(userId: string, isOwner: boolean): Promise<RentalDocument[]> {
    const filter = isOwner ? { owner: userId } : { borrower: userId };
    return this.rentalModel.find({ ...filter, status: { $in: [RentalStatus.RETURNED, RentalStatus.COMPLETED] } }).populate('product').exec();
  }

  async findById(id: string): Promise<RentalDocument> {
    const rental = await this.rentalModel.findById(id).populate('product booking borrower owner').exec();
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  async requestReturn(id: string, borrowerId: string): Promise<RentalDocument> {
    const rental = await this.findById(id);
    if (String((rental.borrower as any)._id || rental.borrower) !== String(borrowerId)) {
      throw new UnauthorizedException('You do not own this rental');
    }
    if (rental.status !== RentalStatus.ACTIVE) {
      throw new BadRequestException('Rental is not currently active');
    }
    
    rental.status = RentalStatus.RETURN_REQUESTED;
    rental.returnRequestedAt = new Date();
    return rental.save();
  }

  async completeRental(id: string, ownerId: string): Promise<RentalDocument> {
    const rental = await this.findById(id);
    if (String((rental.owner as any)._id || rental.owner) !== String(ownerId)) {
      throw new UnauthorizedException('You do not own the product for this rental');
    }
    if (rental.status !== RentalStatus.RETURN_REQUESTED && rental.status !== RentalStatus.RETURNED) {
      throw new BadRequestException('Borrower has not requested a return yet');
    }

    rental.status = RentalStatus.COMPLETED;
    rental.completedAt = new Date();
    return rental.save();
  }
}
