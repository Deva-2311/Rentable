import {
  Controller,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument, ProductStatus } from '../products/schemas/product.schema';
import { Booking, BookingDocument, BookingStatus, PaymentStatus } from '../bookings/schemas/booking.schema';
import { Rental, RentalDocument, RentalStatus } from '../rentals/schemas/rental.schema';
import { Payment, PaymentDocument, PaymentState } from '../payments/schemas/payment.schema';
import { AuditLog, AuditLogDocument } from '../audit/schemas/audit-log.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/role.enum';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { RentalsService } from '../rentals/rentals.service';
import { BookingsService } from '../bookings/bookings.service';
import { UpdateBookingStatusDto, AdminUpdateProductDto } from './dto/admin-operations.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
export class AdminDashboardController {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Rental.name) private rentalModel: Model<RentalDocument>,
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLogDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private rentalsService: RentalsService,
    private bookingsService: BookingsService,
  ) {}

  @Get('stats')
  async getStats() {
    const totalUsers = await this.userModel.countDocuments();
    const totalProducts = await this.productModel.countDocuments();
    const totalBookings = await this.bookingModel.countDocuments();
    const activeRentals = await this.rentalModel.countDocuments({ status: RentalStatus.ACTIVE });
    const pendingBookings = await this.bookingModel.countDocuments({ status: BookingStatus.PENDING });

    const payments = await this.paymentModel.find({ status: PaymentState.SUCCESS });
    const totalRevenue = Math.round(payments.reduce((sum, p) => sum + (p.amount || 0), 0) / 100);
    const totalReviews = await this.reviewModel.countDocuments();

    const recentUsers = await this.userModel
      .find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentBookings = await this.bookingModel
      .find()
      .populate('product', 'name images')
      .populate('borrower', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      success: true,
      data: {
        totalUsers,
        totalProducts,
        totalBookings,
        activeRentals,
        pendingBookings,
        totalRevenue,
        totalPayments: payments.length,
        totalReviews,
        recentUsers,
        recentBookings,
      },
    };
  }

  @Get('users')
  async getUsers() {
    const users = await this.userModel.find().select('-password').sort({ createdAt: -1 });
    return { success: true, data: users };
  }

  @Patch('users/:id/:action')
  async toggleUserStatus(
    @Param('id') id: string,
    @Param('action') action: string,
    @Req() req: AuthenticatedRequest,
  ) {
    if (action !== 'activate' && action !== 'suspend') {
      throw new BadRequestException("Action must be either 'activate' or 'suspend'");
    }

    const targetUser = await this.userModel.findById(id);
    if (!targetUser) {
      throw new NotFoundException('User not found');
    }

    const currentAdminId = String(req.user._id);
    const targetUserId = String(targetUser._id);

    // Prevent admin from suspending self
    if (action === 'suspend' && currentAdminId === targetUserId) {
      throw new ForbiddenException('You cannot suspend your own administrative account');
    }

    // Protect the last active administrator
    if (
      action === 'suspend' &&
      (targetUser.role === UserRole.ADMIN || targetUser.role === UserRole.SUPER_ADMIN)
    ) {
      const activeAdminCount = await this.userModel.countDocuments({
        role: { $in: [UserRole.ADMIN, UserRole.SUPER_ADMIN] },
        isActive: true,
      });

      if (activeAdminCount <= 1) {
        throw new ForbiddenException('Cannot suspend the last active administrator');
      }
    }

    const isActive = action === 'activate';
    const previousState = { isActive: targetUser.isActive };
    targetUser.isActive = isActive;
    await targetUser.save();

    // Persist to audit log
    await this.auditLogModel.create({
      adminId: new Types.ObjectId(currentAdminId),
      adminRole: req.user.role,
      action: isActive ? 'USER_ACTIVATED' : 'USER_SUSPENDED',
      targetType: 'User',
      targetId: targetUser._id,
      previousState,
      newState: { isActive },
      reason: `Admin requested account ${action}`,
    });

    return {
      success: true,
      message: `User ${action}d successfully`,
      data: { _id: targetUser._id, isActive: targetUser.isActive },
    };
  }

  @Get('products')
  async getProducts() {
    const products = await this.productModel
      .find()
      .populate('owner', 'fullName email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });
    return { success: true, data: products };
  }

  @Patch('products/:id/toggle-availability')
  async toggleProductAvailability(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const previousState = { availability: product.availability };
    product.availability = !product.availability;
    await product.save();

    const currentAdminId = String(req.user._id);
    await this.auditLogModel.create({
      adminId: new Types.ObjectId(currentAdminId),
      adminRole: req.user.role,
      action: 'PRODUCT_AVAILABILITY_TOGGLED',
      targetType: 'Product',
      targetId: product._id,
      previousState,
      newState: { availability: product.availability },
    });

    return {
      success: true,
      message: `Product is now ${product.availability ? 'available' : 'hidden'} in catalog`,
      data: product,
    };
  }

  @Patch('products/:id')
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: AdminUpdateProductDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const product = await this.productModel.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const previousState = {
      pricePerDay: product.pricePerDay,
      securityDeposit: product.securityDeposit,
      status: product.status,
      availability: product.availability,
    };

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.pricePerDay !== undefined) product.pricePerDay = dto.pricePerDay;
    if (dto.securityDeposit !== undefined) product.securityDeposit = dto.securityDeposit;
    if (dto.availability !== undefined) product.availability = dto.availability;
    if (dto.status !== undefined) product.status = dto.status;

    await product.save();

    const currentAdminId = String(req.user._id);
    await this.auditLogModel.create({
      adminId: new Types.ObjectId(currentAdminId),
      adminRole: req.user.role,
      action: 'PRODUCT_UPDATED',
      targetType: 'Product',
      targetId: product._id,
      previousState,
      newState: dto,
    });

    return {
      success: true,
      message: 'Product updated successfully',
      data: product,
    };
  }

  @Get('bookings')
  async getBookings() {
    const bookings = await this.bookingModel
      .find()
      .populate('product', 'name images pricePerDay securityDeposit location')
      .populate('borrower', 'fullName email phone')
      .populate('owner', 'fullName email phone')
      .sort({ createdAt: -1 });
    return { success: true, data: bookings };
  }

  @Get('bookings/:id')
  async getBookingById(@Param('id') id: string) {
    const booking = await this.bookingModel
      .findById(id)
      .populate('product')
      .populate('borrower', 'fullName email phone')
      .populate('owner', 'fullName email phone');

    if (!booking) throw new NotFoundException('Booking not found');

    const bookingIdStr = String(booking._id);
    const payment = await this.paymentModel.findOne({ booking: bookingIdStr }).sort({ createdAt: -1 });
    const rental = await this.rentalModel.findOne({ booking: bookingIdStr });

    return {
      success: true,
      data: {
        booking,
        payment,
        rental,
      },
    };
  }

  @Patch('bookings/:id/status')
  async updateBookingStatus(
    @Param('id') id: string,
    @Body() dto: UpdateBookingStatusDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) throw new NotFoundException('Booking not found');

    const currentStatus = booking.status;
    const targetStatus = dto.status;

    if (currentStatus === targetStatus) {
      return { success: true, message: 'Status is already ' + targetStatus, data: booking };
    }

    // Terminal statuses cannot be transitioned
    if (
      currentStatus === BookingStatus.CANCELLED ||
      currentStatus === BookingStatus.COMPLETED ||
      currentStatus === BookingStatus.REJECTED
    ) {
      throw new BadRequestException(
        `Cannot change status of a booking that is currently ${currentStatus}`,
      );
    }

    // Permitted state transitions:
    // PENDING -> CONFIRMED, REJECTED, CANCELLED
    // CONFIRMED -> ACTIVE, CANCELLED
    // ACTIVE -> COMPLETED
    const validTransitions: Record<BookingStatus, BookingStatus[]> = {
      [BookingStatus.PENDING]: [
        BookingStatus.CONFIRMED,
        BookingStatus.REJECTED,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.CONFIRMED]: [
        BookingStatus.ACTIVE,
        BookingStatus.CANCELLED,
      ],
      [BookingStatus.ACTIVE]: [
        BookingStatus.COMPLETED,
      ],
      [BookingStatus.REJECTED]: [],
      [BookingStatus.CANCELLED]: [],
      [BookingStatus.COMPLETED]: [],
      [BookingStatus.RETURNED]: [BookingStatus.COMPLETED],
    };

    const allowed = validTransitions[currentStatus] || [];
    if (!allowed.includes(targetStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${targetStatus}. Permitted: ${allowed.join(', ') || 'None'}`,
      );
    }

    const previousState = { status: currentStatus };
    booking.status = targetStatus;

    // If moving to ACTIVE and paid, ensure rental tracking document exists
    const bookingIdStr = String(booking._id);
    if (targetStatus === BookingStatus.ACTIVE) {
      const existingRental = await this.rentalModel.findOne({ booking: bookingIdStr });
      if (!existingRental) {
        await this.rentalsService.createRental(bookingIdStr);
      }
    } else if (targetStatus === BookingStatus.COMPLETED) {
      await this.rentalModel.updateOne(
        { booking: bookingIdStr },
        { status: RentalStatus.COMPLETED, completedAt: new Date() },
      );
    }

    await booking.save();

    const currentAdminId = String(req.user._id);
    await this.auditLogModel.create({
      adminId: new Types.ObjectId(currentAdminId),
      adminRole: req.user.role,
      action: 'BOOKING_STATUS_TRANSITION',
      targetType: 'Booking',
      targetId: booking._id,
      previousState,
      newState: { status: targetStatus },
      reason: dto.reason || 'Admin status transition',
    });

    return {
      success: true,
      message: `Booking status updated to ${targetStatus}`,
      data: booking,
    };
  }

  @Get('audit-logs')
  async getAuditLogs() {
    const logs = await this.auditLogModel
      .find()
      .populate('adminId', 'fullName email role')
      .sort({ createdAt: -1 })
      .limit(50);
    return { success: true, data: logs };
  }

  @Get('payments')
  async getPayments() {
    const payments = await this.paymentModel
      .find()
      .populate('user', 'fullName email phone')
      .populate('booking', 'bookingId totalAmount status')
      .sort({ createdAt: -1 });
    return { success: true, data: payments };
  }

  @Get('reviews')
  async getReviews() {
    const reviews = await this.reviewModel
      .find()
      .populate('reviewer', 'fullName email')
      .populate('product', 'name images')
      .populate('booking', 'bookingId')
      .sort({ createdAt: -1 });
    return { success: true, data: reviews };
  }

  @Delete('reviews/:id')
  async deleteReview(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');

    const previousState = {
      product: review.product,
      booking: review.booking,
      reviewer: review.reviewer,
      rating: review.rating,
      comment: review.comment,
    };

    await this.reviewModel.findByIdAndDelete(id);

    const currentAdminId = String(req.user._id);
    await this.auditLogModel.create({
      adminId: new Types.ObjectId(currentAdminId),
      adminRole: req.user.role,
      action: 'REVIEW_DELETED',
      targetType: 'Review',
      targetId: review._id,
      previousState,
      reason: 'Admin content moderation (violates platform guidelines or spam)',
    });

    return {
      success: true,
      message: 'Review deleted successfully',
      data: { _id: id },
    };
  }
}

