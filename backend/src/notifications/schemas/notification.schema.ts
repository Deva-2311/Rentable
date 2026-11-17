import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_ACCEPTED = 'BOOKING_ACCEPTED',
  BOOKING_REJECTED = 'BOOKING_REJECTED',
  PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
  RENTAL_STARTING = 'RENTAL_STARTING',
  RENTAL_ENDING = 'RENTAL_ENDING',
  RETURN_REMINDER = 'RETURN_REMINDER',
  REVIEW_REMINDER = 'REVIEW_REMINDER',
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: String, enum: NotificationType, required: true })
  type: NotificationType;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
