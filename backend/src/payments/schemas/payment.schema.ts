import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

export enum PaymentMethod {
  RAZORPAY = 'RAZORPAY',
}

export enum PaymentState {
  CREATED = 'CREATED',
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
  booking: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ required: true })
  razorpayOrderId: string;

  @Prop()
  razorpayPaymentId?: string;

  @Prop({ required: true })
  amount: number; // Stored in smallest currency unit (e.g. paise for INR)

  @Prop({ default: 'INR' })
  currency: string;

  @Prop({ type: String, enum: PaymentState, default: PaymentState.CREATED })
  status: PaymentState;

  @Prop({ type: String, enum: PaymentMethod, default: PaymentMethod.RAZORPAY })
  paymentMethod: PaymentMethod;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
