import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

export enum ReportStatus {
  OPEN = 'OPEN',
  INVESTIGATING = 'INVESTIGATING',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum ReportTargetType {
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  REVIEW = 'REVIEW',
}

export enum ReportPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Schema({ timestamps: true })
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter!: Types.ObjectId;

  @Prop({ type: String, required: true, enum: Object.values(ReportTargetType) })
  targetType!: ReportTargetType;

  @Prop({ type: Types.ObjectId, required: true })
  targetId!: Types.ObjectId;

  @Prop({ required: true })
  reason!: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(ReportPriority),
    default: ReportPriority.LOW,
  })
  priority!: ReportPriority;

  @Prop({
    type: String,
    enum: Object.values(ReportStatus),
    default: ReportStatus.OPEN,
  })
  status!: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedAdmin?: Types.ObjectId;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
