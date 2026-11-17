import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type RentalDocument = Rental & Document;

export enum RentalStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  RETURN_REQUESTED = 'RETURN_REQUESTED',
  RETURNED = 'RETURNED',
  COMPLETED = 'COMPLETED',
}

@Schema({ timestamps: true })
export class Rental {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
  booking: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  borrower: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: String, enum: RentalStatus, default: RentalStatus.UPCOMING })
  status: RentalStatus;

  @Prop()
  returnRequestedAt?: Date;

  @Prop()
  returnedAt?: Date;

  @Prop()
  completedAt?: Date;
}

export const RentalSchema = SchemaFactory.createForClass(Rental);
