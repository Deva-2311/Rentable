import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../common/enums/role.enum';

export class RegisterDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsIn([UserRole.BORROWER, UserRole.OWNER], {
    message: 'Role must be either borrower or owner',
  })
  @IsNotEmpty()
  role: UserRole;
}
