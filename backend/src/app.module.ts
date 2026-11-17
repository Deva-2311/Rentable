import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import configuration from './config/configuration';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { RentalsModule } from './rentals/rentals.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AdminModule } from './admin/admin.module';
import { OwnerModule } from './owner/owner.module';
import { UploadsModule } from './uploads/uploads.module';
import { DisputesModule } from './disputes/disputes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get<number>('throttler.ttl') ?? 60,
          limit: configService.get<number>('throttler.limit') ?? 100,
        },
      ],
      inject: [ConfigService],
    }),
    DatabaseModule,
    HealthModule,
    CommonModule,
    UsersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    BookingsModule,
    PaymentsModule,
    RentalsModule,
    ReviewsModule,
    WishlistModule,
    NotificationsModule,
    AdminModule,
    OwnerModule,
    UploadsModule,
    DisputesModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
