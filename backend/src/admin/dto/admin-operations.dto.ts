import { IsEnum, IsOptional, IsString, IsNumber, IsBoolean } from 'class-validator';
import { BookingStatus } from '../../bookings/schemas/booking.schema';
import { ProductStatus } from '../../products/schemas/product.schema';

export class UpdateBookingStatusDto {
  @IsEnum(BookingStatus)
  status!: BookingStatus;

  @IsOptional()
  @IsString()
  reason?: string;
}

export class AdminUpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  securityDeposit?: number;

  @IsOptional()
  @IsBoolean()
  availability?: boolean;

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
