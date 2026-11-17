import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PromotionDocument = Promotion & Document;

export enum PromotionType {
  FEATURED_PRODUCT = 'FEATURED_PRODUCT',
  HOMEPAGE_BANNER = 'HOMEPAGE_BANNER',
  COLLECTION = 'COLLECTION',
  SEASONAL_CAMPAIGN = 'SEASONAL_CAMPAIGN',
}

@Schema({ timestamps: true })
export class Promotion {
  @Prop({ required: true })
  title!: string;

  @Prop()
  description?: string;

  @Prop({
    type: String,
    enum: Object.values(PromotionType),
    required: true,
  })
  type!: PromotionType;

  @Prop()
  imageUrl?: string;

  @Prop()
  targetUrl?: string; // e.g., '/category/cameras'

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  featuredProducts?: Types.ObjectId[]; // Array of product IDs if it's a collection/featured list

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  targetCategory?: Types.ObjectId;

  @Prop()
  targetLocation?: string;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy!: Types.ObjectId; // Admin who created it
}

export const PromotionSchema = SchemaFactory.createForClass(Promotion);
