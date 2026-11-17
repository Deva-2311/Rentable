import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { Model, Types, isValidObjectId } from 'mongoose';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import {
  Booking,
  BookingDocument,
  BookingStatus,
  PaymentStatus,
} from '../bookings/schemas/booking.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import {
  Rental,
  RentalDocument,
  RentalStatus,
} from '../rentals/schemas/rental.schema';

@ApiTags('Owner Dashboard')
@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN)
@ApiBearerAuth()
export class OwnerController {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get owner statistics (Owner only)' })
  async getStats(@Req() req: AuthenticatedRequest) {
    const ownerIdStr = String(req.user._id);
    const ownerObjId = isValidObjectId(ownerIdStr) ? new Types.ObjectId(ownerIdStr) : null;
    const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };

    const [
      myProducts,
      pendingRequests,
      activeRentals,
      completedRentals,
      earningsResult,
    ] = await Promise.all([
      this.productModel.countDocuments(ownerFilter as any),
      this.bookingModel.countDocuments({
        ...(ownerFilter as any),
        status: BookingStatus.PENDING,
      }),
      this.rentalModel.countDocuments({
        ...(ownerFilter as any),
        status: RentalStatus.ACTIVE,
      }),
      this.rentalModel.countDocuments({
        ...(ownerFilter as any),
        status: RentalStatus.COMPLETED,
      }),
      this.bookingModel.aggregate([
        {
          $match: {
            ...(ownerObjId
              ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] }
              : { owner: ownerIdStr }),
            paymentStatus: PaymentStatus.PAID,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$rentalAmount' },
          },
        },
      ]),
    ]);

    const totalEarnings =
      earningsResult.length > 0 ? earningsResult[0].total : 0;

    return {
      success: true,
      data: {
        myProducts,
        pendingRequests,
        activeRentals,
        completedRentals,
        totalEarnings,
      },
    };
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all booking requests for owner products' })
  async getBookings(@Req() req: AuthenticatedRequest) {
    const ownerIdStr = String(req.user._id);
    const ownerObjId = isValidObjectId(ownerIdStr) ? new Types.ObjectId(ownerIdStr) : null;
    const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };

    const bookings = await this.bookingModel
      .find(ownerFilter as any)
      .populate('product', 'name images pricePerDay securityDeposit location condition')
      .populate('borrower', 'fullName email phone avatar')
      .sort({ createdAt: -1 })
      .exec();

    return { success: true, data: bookings };
  }

  @Get('products')
  @ApiOperation({ summary: 'Get owner product listings' })
  async getProducts(@Req() req: AuthenticatedRequest) {
    const ownerIdStr = String(req.user._id);
    const ownerObjId = isValidObjectId(ownerIdStr) ? new Types.ObjectId(ownerIdStr) : null;
    const ownerFilter = ownerObjId ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] } : { owner: ownerIdStr };

    const products = await this.productModel
      .find(ownerFilter as any)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .exec();

    return { success: true, data: products };
  }
}

