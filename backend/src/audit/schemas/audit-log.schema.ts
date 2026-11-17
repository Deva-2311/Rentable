import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  adminId!: Types.ObjectId;

  @Prop({ required: true })
  adminRole!: string;

  @Prop({ required: true })
  action!: string; // e.g., 'USER_SUSPENDED', 'PRODUCT_APPROVED'

  @Prop({ required: true })
  targetType!: string; // e.g., 'User', 'Product', 'Booking', 'Dispute'

  @Prop({ type: Types.ObjectId, required: true })
  targetId!: Types.ObjectId;

  @Prop({ type: Object })
  previousState?: Record<string, any>;

  @Prop({ type: Object })
  newState?: Record<string, any>;

  @Prop()
  reason?: string;

  @Prop()
  ipAddress?: string;

  @Prop()
  requestId?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
