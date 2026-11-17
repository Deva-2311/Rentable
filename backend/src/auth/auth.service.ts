import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  private async generateTokens(user: any) {
    const payload = { sub: user._id, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenModel.create({
      user: user._id,
      token: refreshToken,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async register(registerDto: RegisterDto) {
    if (!registerDto.fullName && !registerDto.name) {
      throw new BadRequestException('Full name is required');
    }
    const user = await this.usersService.create(registerDto);
    const tokens = await this.generateTokens(user);

    return {
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await (user as any).comparePassword(loginDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const tokens = await this.generateTokens(user);

    return {
      _id: user._id,
      name: user.fullName,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      token: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(refreshDto: RefreshTokenDto) {
    const tokenRecord = await this.refreshTokenModel
      .findOne({
        token: refreshDto.refreshToken,
        isRevoked: false,
        expiresAt: { $gt: new Date() },
      })
      .populate('user');

    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = tokenRecord.user as any;
    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    // Revoke old token
    tokenRecord.isRevoked = true;
    await tokenRecord.save();

    // Generate new tokens
    const tokens = await this.generateTokens(user);
    return tokens;
  }

  async logout(refreshToken: string) {
    await this.refreshTokenModel.updateOne(
      { token: refreshToken },
      { isRevoked: true },
    );
    return { success: true, message: 'Logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal if user exists
      return {
        success: true,
        message: 'If the email exists, a reset link has been sent',
      };
    }

    // Mock sending email
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Ideally save to DB, but for this MVP, we will mock it
    console.log(
      `[MOCK EMAIL] Reset link for ${user.email}: http://localhost:3000/reset-password?token=${resetToken}`,
    );

    return {
      success: true,
      message: 'If the email exists, a reset link has been sent',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // Mock implementation for MVP
    if (resetPasswordDto.token.length < 10) {
      throw new BadRequestException('Invalid reset token');
    }
    return { success: true, message: 'Password reset successfully' };
  }

  async verifyEmail(email: string) {
    console.log(
      `[MOCK EMAIL] Verification link for ${email}: http://localhost:3000/verify-email`,
    );
    return { success: true, message: 'Verification email sent' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    // Requires usersService to implement changePassword
    await this.usersService.changePassword(
      userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
    return { success: true, message: 'Password changed successfully' };
  }
}
