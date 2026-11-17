import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { BookingsModule } from '../bookings/bookings.module';
import { RentalsModule } from '../rentals/rentals.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    BookingsModule,
    RentalsModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
