import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Rental, RentalDocument, RentalStatus } from './schemas/rental.schema';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/schemas/booking.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class RentalsService {
  constructor(
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
    @Inject(forwardRef(() => BookingsService))
    private bookingsService: BookingsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async createRental(bookingId: string): Promise<RentalDocument> {
    const booking = await this.bookingsService.findById(bookingId);

    const rental = new this.rentalModel({
      booking: booking._id,
      product: booking.product,
      borrower: booking.borrower,
      owner: booking.owner,
      startDate: booking.startDate,
      endDate: booking.endDate,
      status: RentalStatus.ACTIVE,
    });

    const saved = await rental.save();

    // Notify both parties that rental is now active
    const borrowerId = String(
      (booking.borrower as any)?._id || booking.borrower,
    );
    const ownerId = String((booking.owner as any)?._id || booking.owner);
    this.notificationsGateway.notifyUser(borrowerId, 'rental:active', {
      message: 'Payment confirmed! Your rental is now active.',
      rentalId: saved._id,
    });
    this.notificationsGateway.notifyUser(ownerId, 'rental:active', {
      message: 'Payment received. A rental for your product is now active.',
      rentalId: saved._id,
    });

    return saved;
  }

  async getAllRentals(
    userId: string,
    isOwner: boolean,
  ): Promise<RentalDocument[]> {
    const filter = isOwner ? { owner: userId } : { borrower: userId };
    return this.rentalModel
      .find(filter)
      .populate('product')
      .populate('owner', 'fullName email phone avatar')
      .populate('borrower', 'fullName email phone avatar')
      .populate('booking')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getActiveRentals(
    userId: string,
    isOwner: boolean,
  ): Promise<RentalDocument[]> {
    const filter = isOwner ? { owner: userId } : { borrower: userId };
    return this.rentalModel
      .find({
        ...filter,
        status: {
          $in: [RentalStatus.ACTIVE, RentalStatus.RETURN_REQUESTED],
        },
      })
      .populate('product')
      .populate('owner', 'fullName email phone avatar')
      .populate('borrower', 'fullName email phone avatar')
      .populate('booking')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getHistory(
    userId: string,
    isOwner: boolean,
  ): Promise<RentalDocument[]> {
    const filter = isOwner ? { owner: userId } : { borrower: userId };
    return this.rentalModel
      .find({
        ...filter,
        status: { $in: [RentalStatus.RETURNED, RentalStatus.COMPLETED] },
      })
      .populate('product')
      .populate('owner', 'fullName email phone avatar')
      .populate('borrower', 'fullName email phone avatar')
      .populate('booking')
      .sort({ completedAt: -1, updatedAt: -1, createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<RentalDocument> {
    const rental = await this.rentalModel
      .findById(id)
      .populate('product booking borrower owner')
      .exec();
    if (!rental) {
      throw new NotFoundException('Rental not found');
    }
    return rental;
  }

  async requestReturn(id: string, borrowerId: string): Promise<RentalDocument> {
    const rental = await this.findById(id);
    if (
      String((rental.borrower as any)._id || rental.borrower) !==
      String(borrowerId)
    ) {
      throw new UnauthorizedException('You do not own this rental');
    }
    if (rental.status !== RentalStatus.ACTIVE) {
      throw new BadRequestException('Rental is not currently active');
    }

    rental.status = RentalStatus.RETURN_REQUESTED;
    rental.returnRequestedAt = new Date();
    const saved = await rental.save();

    // Notify owner that borrower wants to return the product
    const ownerId = String((saved.owner as any)?._id || saved.owner);
    this.notificationsGateway.notifyUser(ownerId, 'rental:return_requested', {
      message:
        'A borrower has requested to return a product. Please confirm the return.',
      rentalId: saved._id,
      productName: (saved.product as any)?.name,
    });

    return saved;
  }

  async completeRental(id: string, ownerId: string): Promise<RentalDocument> {
    const rental = await this.findById(id);
    if (String((rental.owner as any)._id || rental.owner) !== String(ownerId)) {
      throw new UnauthorizedException(
        'You do not own the product for this rental',
      );
    }
    if (
      rental.status !== RentalStatus.RETURN_REQUESTED &&
      rental.status !== RentalStatus.RETURNED
    ) {
      throw new BadRequestException('Borrower has not requested a return yet');
    }

    rental.status = RentalStatus.COMPLETED;
    rental.completedAt = new Date();
    await rental.save();

    // Also update the parent Booking status
    await this.bookingsService.internalUpdateStatus(
      String((rental.booking as any)._id || rental.booking),
      BookingStatus.COMPLETED,
    );

    // Notify borrower that return is confirmed and rental is complete
    const borrowerId = String((rental.borrower as any)?._id || rental.borrower);
    this.notificationsGateway.notifyUser(borrowerId, 'rental:completed', {
      message: 'Your rental has been completed. Thank you for using Rentable!',
      rentalId: rental._id,
    });

    return rental;
  }
}
