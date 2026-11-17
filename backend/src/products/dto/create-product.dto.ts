import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsNotEmpty()
  pricePerDay: number;

  @IsNumber()
  @IsNotEmpty()
  securityDeposit: number;

  @IsString()
  @IsNotEmpty()
  condition: string;

  @IsString()
  @IsNotEmpty()
  location: string;

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
