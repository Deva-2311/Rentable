import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingsModule } from '../bookings/bookings.module';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { Rental, RentalSchema } from './schemas/rental.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rental.name, schema: RentalSchema }]),
    forwardRef(() => BookingsModule),
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
  exports: [RentalsService],
})
export class RentalsModule {}
