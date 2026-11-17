import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDisputeDto {
  @IsString()
  @IsNotEmpty()
  bookingId!: string;

  @IsString()
  @IsNotEmpty()
  reason!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsArray()
  @IsOptional()
  evidenceUrls?: string[];
}
