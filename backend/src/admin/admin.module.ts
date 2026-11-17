import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Rental, RentalSchema } from '../rentals/schemas/rental.schema';
import { AuditLog, AuditLogSchema } from '../audit/schemas/audit-log.schema';
import { Review, ReviewSchema } from '../reviews/schemas/review.schema';
import { AdminAuthModule } from './admin-auth/admin-auth.module';
import { AdminUsersModule } from './admin-users/admin-users.module';
import { AdminProductsModule } from './admin-products/admin-products.module';
import { AdminFinanceModule } from './admin-finance/admin-finance.module';
import { AdminTrustModule } from './admin-trust/admin-trust.module';
import { AdminAnalyticsModule } from './admin-analytics/admin-analytics.module';
import { AdminDashboardController } from './admin-dashboard.controller';
import { RentalsModule } from '../rentals/rentals.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Rental.name, schema: RentalSchema },
      { name: AuditLog.name, schema: AuditLogSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    RentalsModule,
    BookingsModule,
    AdminAuthModule,
    AdminUsersModule,
    AdminProductsModule,
    AdminFinanceModule,
    AdminTrustModule,
    AdminAnalyticsModule,
  ],
  controllers: [AdminDashboardController],
})
export class AdminModule {}

