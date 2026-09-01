import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  pricePerDay?: number;

  @IsNumber()
  @IsOptional()
  securityDeposit?: number;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsBoolean()
  @IsOptional()
  availability?: boolean;

  @IsString()
  @IsOptional()
  rentalRules?: string;

  @IsString()
  @IsOptional()
  cancellationPolicy?: string;
}
