import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type DisputeDocument = Dispute & Document;

export enum DisputeStatus {
  OPENED = 'OPENED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  EVIDENCE_REQUESTED = 'EVIDENCE_REQUESTED',
  MEDIATION = 'MEDIATION',
  RESOLVED = 'RESOLVED',
  ESCALATED = 'ESCALATED',
  CLOSED = 'CLOSED',
}

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ type: Types.ObjectId, ref: 'Booking', required: true })
  booking!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  openedBy!: Types.ObjectId; // Borrower or Owner

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  targetUser!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product!: Types.ObjectId;

  @Prop({ required: true })
  reason!: string; // Product damage, late return, missing accessories, etc.

  @Prop({ required: true })
  description!: string;

  @Prop({
    type: String,
    enum: Object.values(DisputeStatus),
    default: DisputeStatus.OPENED,
  })
  status!: DisputeStatus;

  @Prop({ type: [String], default: [] })
  evidenceUrls!: string[]; // Cloudinary/S3 URLs of images/videos

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedAdmin?: Types.ObjectId;

  @Prop({ type: Object })
  resolution?: {
    action: string; // 'REFUND_BORROWER', 'DEDUCT_DEPOSIT', 'RELEASE_OWNER_PAYMENT'
    amount?: number;
    reason: string;
    resolvedAt: Date;
    resolvedBy: Types.ObjectId;
  };
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
