import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SecurityDepositDocument = SecurityDeposit & Document;

export enum DepositStatus {
  HELD = 'HELD',
  RELEASE_PENDING = 'RELEASE_PENDING',
  RELEASED = 'RELEASED',
  PARTIALLY_DEDUCTED = 'PARTIALLY_DEDUCTED',
  FULLY_DEDUCTED = 'FULLY_DEDUCTED',
  DISPUTED = 'DISPUTED',
}

@Schema({ timestamps: true })
export class SecurityDeposit {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true, unique: true })
  booking!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  borrower!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner!: Types.ObjectId;

  @Prop({ required: true })
  amount!: number; // In smallest currency unit (e.g. paise)

  @Prop({
    type: String,
    enum: Object.values(DepositStatus),
    default: DepositStatus.HELD,
  })
  status!: DepositStatus;

  @Prop({ type: Types.ObjectId, ref: 'Payment' })
  originalPaymentId?: Types.ObjectId;

  @Prop({ type: [Object], default: [] })
  deductions!: {
    amount: number;
    reason: string;
    evidenceUrls?: string[];
    deductedBy: Types.ObjectId; // Admin who authorized
    deductedAt: Date;
  }[];

  @Prop({ default: 0 })
  totalDeducted!: number;

  @Prop()
  releasedAt?: Date;

  @Prop()
  gatewayRefundId?: string; // Reference for the release/refund back to source
}

export const SecurityDepositSchema =
  SchemaFactory.createForClass(SecurityDeposit);
