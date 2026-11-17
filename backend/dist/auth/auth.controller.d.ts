import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    logout(refreshDto: RefreshTokenDto): Promise<{
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
    changePassword(req: AuthenticatedRequest, changePasswordDto: ChangePasswordDto): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: AuthenticatedRequest): {
        _id: import("mongoose").Types.ObjectId;
        name: string;
        email: string;
        role: import("../common/enums/role.enum").UserRole;
        avatar: string;
        phone: string;
        walletBalance: number;
        isVerified: boolean;
        isActive: boolean;
    };
}
