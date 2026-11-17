import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;
}

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  razorpayOrderId: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}

export class SimulatePaymentDto {
  @IsString()
  @IsNotEmpty()
  bookingId: string;

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsOptional()
  simulationStatus?: string;
}

