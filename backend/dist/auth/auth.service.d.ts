import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { Model } from 'mongoose';
import { RefreshTokenDocument } from './schemas/refresh-token.schema';
export declare class AuthService {
    private usersService;
    private jwtService;
    private refreshTokenModel;
    constructor(usersService: UsersService, jwtService: JwtService, refreshTokenModel: Model<RefreshTokenDocument>);
    private generateTokens;
    register(registerDto: RegisterDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        fullName: string;
        email: string;
        role: import("../common/enums/role.enum").UserRole;
        token: string;
        refreshToken: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        _id: import("mongoose").Types.ObjectId;
        name: string;
        fullName: string;
        email: string;
        role: import("../common/enums/role.enum").UserRole;
        token: string;
        refreshToken: string;
    }>;
    refresh(refreshDto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    logout(refreshToken: string): Promise<{
        success: boolean;
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    verifyEmail(email: string): Promise<{
        success: boolean;
        message: string;
    }>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
