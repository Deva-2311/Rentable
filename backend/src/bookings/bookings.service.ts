import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from './schemas/booking.schema';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ProductsService } from '../products/products.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class BookingsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    private productsService: ProductsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(
    borrowerId: string,
    createBookingDto: CreateBookingDto,
  ): Promise<BookingDocument> {
    const product = await this.productsService.findById(
      createBookingDto.product,
    );

    if (!product.availability) {
      throw new BadRequestException('Product is not currently available');
    }

    const start = new Date(createBookingDto.startDate);
    const end = new Date(createBookingDto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    // ── Double-booking prevention ─────────────────────────────────────────────
    const productIdStr = String(product._id);
    const productQuery = isValidObjectId(productIdStr)
      ? { $in: [new Types.ObjectId(productIdStr), productIdStr] }
      : productIdStr;

    const overlapping = await this.bookingModel.findOne({
      product: productQuery as any,
      status: {
        $in: [
          BookingStatus.PENDING,
          BookingStatus.CONFIRMED,
          BookingStatus.ACTIVE,
        ],
      },
      $or: [
        { startDate: { $lt: end, $gte: start } },
        { endDate: { $gt: start, $lte: end } },
        { startDate: { $lte: start }, endDate: { $gte: end } },
      ],
    });

    if (overlapping) {
      throw new BadRequestException(
        'Product is already booked for the selected dates. Please choose different dates.',
      );
    }
    // ─────────────────────────────────────────────────────────────────────────

    const duration = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 3600 * 24),
    );
    const rentalAmount = duration * product.pricePerDay;
    const platformFee = rentalAmount * 0.1; // 10% platform fee
    const totalAmount = rentalAmount + product.securityDeposit + platformFee;

    const bookingId = `BKG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const createdBooking = new this.bookingModel({
      bookingId,
      borrower: borrowerId,
      owner: product.owner,
      product: product._id,
      startDate: start,
      endDate: end,
      duration,
      rentalAmount,
      securityDeposit: product.securityDeposit,
      platformFee,
      totalAmount,
      status: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
    });

    const saved = await createdBooking.save();

    // Notify owner about a new booking request
    this.notificationsGateway.notifyUser(
      String(product.owner),
      'booking:new_request',
      {
        message: 'A new booking request has been received.',
        bookingId: saved._id,
        productName: product.name,
      },
    );

    return saved;
  }

  async findByBorrower(borrowerId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ borrower: borrowerId })
      .populate('product', 'name images pricePerDay securityDeposit location condition')
      .populate('owner', 'fullName email phone avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findByOwner(ownerId: string): Promise<BookingDocument[]> {
    return this.bookingModel
      .find({ owner: ownerId })
      .populate('product', 'name images pricePerDay securityDeposit location condition')
      .populate('borrower', 'fullName email phone avatar')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<BookingDocument> {
    const booking = await this.bookingModel
      .findById(id)
      .populate('product')
      .populate('borrower', 'fullName email phone avatar')
      .populate('owner', 'fullName email phone avatar')
      .exec();
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateStatus(
    id: string,
    status: BookingStatus,
    userId: string,
    isOwner: boolean,
  ): Promise<BookingDocument> {
    const booking = await this.findById(id);

    if (isOwner) {
      const bookingOwnerId = String(
        (booking.owner as any)._id || booking.owner,
      );
      const requestUserId = String(userId);
      if (bookingOwnerId !== requestUserId) {
        throw new UnauthorizedException('You do not own this product');
      }
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        `Cannot change status of a booking that is currently ${booking.status}. It must be PENDING.`,
      );
    }

    booking.status = status;
    const saved = await booking.save();

    const borrowerId = String((saved.borrower as any)?._id || saved.borrower);
    const statusMessages: Partial<Record<BookingStatus, string>> = {
      [BookingStatus.CONFIRMED]:
        'Your booking request has been accepted! Proceed to payment.',
      [BookingStatus.REJECTED]: 'Your booking request has been declined.',
    };
    const msg = statusMessages[status];
    if (msg) {
      this.notificationsGateway.notifyUser(
        borrowerId,
        'booking:status_updated',
        {
          message: msg,
          bookingId: saved._id,
          status,
        },
      );
    }

    return saved;
  }

  /** Internal service-to-service status update — bypasses ownership check */
  async internalUpdateStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.status = status;
    return booking.save();
  }

  async internalUpdatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
  ): Promise<BookingDocument> {
    const booking = await this.bookingModel.findById(id).exec();
    if (!booking) throw new NotFoundException('Booking not found');
    booking.paymentStatus = paymentStatus;
    return booking.save();
  }

  async cancelBooking(
    id: string,
    borrowerId: string,
  ): Promise<BookingDocument> {
    const booking = await this.findById(id);

    const borrowerIdStr = String(
      (booking.borrower as any)._id || booking.borrower,
    );
    if (borrowerIdStr !== String(borrowerId)) {
      throw new UnauthorizedException('You can only cancel your own bookings');
    }

    const cancellableStatuses: BookingStatus[] = [
      BookingStatus.PENDING,
      BookingStatus.CONFIRMED,
    ];
    if (!cancellableStatuses.includes(booking.status)) {
      throw new BadRequestException(
        `Cannot cancel a booking with status: ${booking.status}`,
      );
    }

    booking.status = BookingStatus.CANCELLED;
    const saved = await booking.save();

    // Notify the owner that a booking was cancelled
    const ownerId = String((saved.owner as any)?._id || saved.owner);
    this.notificationsGateway.notifyUser(ownerId, 'booking:status_updated', {
      message: 'A booking request for your product has been cancelled.',
      bookingId: saved._id,
      status: BookingStatus.CANCELLED,
    });

    return saved;
  }
}
