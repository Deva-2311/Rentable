import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { Rental, RentalSchema } from './schemas/rental.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rental.name, schema: RentalSchema }]),
  ],
  providers: [RentalsService],
  controllers: [RentalsController],
  exports: [RentalsService],
})
export class RentalsModule {}
