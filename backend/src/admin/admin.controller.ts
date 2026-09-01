import { Controller, Get, UseGuards, Inject, Patch, Param, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Booking, BookingDocument, BookingStatus } from '../bookings/schemas/booking.schema';
import { Payment, PaymentDocument } from '../payments/schemas/payment.schema';
import { Rental, RentalDocument, RentalStatus } from '../rentals/schemas/rental.schema';

@ApiTags('Admin Dashboard')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@ApiBearerAuth()
export class AdminController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
  ) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get overall platform statistics (Admin only)' })
  async getStats() {
    const [
      totalUsers,
      totalProducts,
      totalBookings,
      activeRentals,
      revenueResult,
      pendingBookings,
      recentUsers,
    ] = await Promise.all([
      this.userModel.countDocuments({}),
      this.productModel.countDocuments({}),
      this.bookingModel.countDocuments({}),
      this.rentalModel.countDocuments({ status: RentalStatus.ACTIVE }),
      this.paymentModel.aggregate([
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      this.bookingModel.countDocuments({ status: BookingStatus.PENDING }),
      this.userModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .select('fullName email role createdAt')
        .exec(),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].total / 100 : 0; // Convert paise to INR

    return {
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalBookings,
        activeRentals,
        pendingBookings,
        totalRevenue,
        recentUsers,
      },
    };
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  async getUsers() {
    const users = await this.userModel
      .find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    return { success: true, data: users };
  }

  @Patch('users/:id/suspend')
  @ApiOperation({ summary: 'Suspend a user (Admin only)' })
  async suspendUser(@Param('id') id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
    if (user.role === UserRole.ADMIN) throw new BadRequestException('Cannot suspend another admin');
    
    user.isActive = false;
    await user.save();
    return { success: true, message: 'User suspended successfully' };
  }

  @Patch('users/:id/activate')
  @ApiOperation({ summary: 'Activate a user (Admin only)' })
  async activateUser(@Param('id') id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new BadRequestException('User not found');
    
    user.isActive = true;
    await user.save();
    return { success: true, message: 'User activated successfully' };
  }

  @Get('bookings')
  @ApiOperation({ summary: 'Get all bookings (Admin only)' })
  async getBookings() {
    const bookings = await this.bookingModel
      .find({})
      .populate('product borrower owner', 'name fullName email')
      .sort({ createdAt: -1 })
      .exec();
    return { success: true, data: bookings };
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products (Admin only)' })
  async getProducts() {
    const products = await this.productModel
      .find({})
      .populate('owner', 'fullName email')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .exec();
    return { success: true, data: products };
  }
}
