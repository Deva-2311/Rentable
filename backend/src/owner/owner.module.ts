import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OwnerController } from './owner.controller';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';
import { Payment, PaymentSchema } from '../payments/schemas/payment.schema';
import { Rental, RentalSchema } from '../rentals/schemas/rental.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Rental.name, schema: RentalSchema },
    ]),
  ],
  controllers: [OwnerController],
})
export class OwnerModule {}
