import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Booking, BookingDocument, BookingStatus } from '../bookings/schemas/booking.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { Rental, RentalDocument, RentalStatus } from '../rentals/schemas/rental.schema';

@ApiTags('Owner Dashboard')
@Controller('owner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER)
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
  async getStats(@Req() req: any) {
    const ownerId = req.user._id;

    const [
      myProducts,
      pendingRequests,
      activeRentals,
      completedRentals,
      revenueResult,
    ] = await Promise.all([
      this.productModel.countDocuments({ owner: ownerId }),
      this.bookingModel.countDocuments({ owner: ownerId, status: BookingStatus.PENDING }),
      this.rentalModel.countDocuments({ owner: ownerId, status: RentalStatus.ACTIVE }),
      this.rentalModel.countDocuments({ owner: ownerId, status: RentalStatus.COMPLETED }),
      this.paymentModel.aggregate([
        { $match: { user: ownerId } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    // Revenue is stored in paise — convert to INR
    const totalEarnings = revenueResult.length > 0 ? revenueResult[0].total / 100 : 0;

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
  async getBookings(@Req() req: any) {
    const bookings = await this.bookingModel
      .find({ owner: req.user._id })
      .populate('product', 'name images pricePerDay')
      .populate('borrower', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .exec();

    return { success: true, data: bookings };
  }

  @Get('products')
  @ApiOperation({ summary: 'Get owner product listings' })
  async getProducts(@Req() req: any) {
    const products = await this.productModel
      .find({ owner: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .exec();

    return { success: true, data: products };
  }
}
