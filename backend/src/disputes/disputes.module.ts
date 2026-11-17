import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisputesService } from './disputes.service';
import { DisputesController } from './disputes.controller';
import { Dispute, DisputeSchema } from './schemas/dispute.schema';
import { Booking, BookingSchema } from '../bookings/schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Dispute.name, schema: DisputeSchema },
      { name: Booking.name, schema: BookingSchema },
    ]),
  ],
  providers: [DisputesService],
  controllers: [DisputesController],
  exports: [DisputesService],
})
export class DisputesModule {}
