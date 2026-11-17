import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ResolveDisputeDto {
  @IsString()
  @IsNotEmpty()
  action!: string; // 'REFUND_BORROWER', 'DEDUCT_DEPOSIT', 'RELEASE_OWNER_PAYMENT', 'DISMISSED'

  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsString()
  @IsNotEmpty()
  reason!: string;
}
