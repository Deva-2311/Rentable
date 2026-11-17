import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ProductDocument = Product & Document;

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  REJECTED = 'REJECTED',
  REMOVED = 'REMOVED',
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  owner: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  description: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: string;

  @Prop([String])
  images: string[];

  @Prop({ required: true })
  pricePerDay: number;

  @Prop({ required: true })
  securityDeposit: number;

  @Prop({ required: true })
  condition: string;

  @Prop({ required: true })
  location: string;

  @Prop({ default: true })
  availability: boolean;

  @Prop()
  rentalRules?: string;

  @Prop()
  cancellationPolicy?: string;

  @Prop({ type: String, enum: ProductStatus, default: ProductStatus.PENDING_APPROVAL })
  status: ProductStatus;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
