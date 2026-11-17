import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BookingDocument = Booking & Document;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  RETURNED = 'RETURNED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Schema({ timestamps: true })
export class Booking {
  @Prop({ unique: true })
  bookingId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  borrower: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true })
  product: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  duration: number; // in days

  @Prop({ required: true })
  rentalAmount: number;

  @Prop({ required: true })
  securityDeposit: number;

  @Prop({ required: true })
  platformFee: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({ type: String, enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
