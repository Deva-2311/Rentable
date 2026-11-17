"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const refresh_token_schema_1 = require("./schemas/refresh-token.schema");
const crypto = __importStar(require("crypto"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    refreshTokenModel;
    constructor(usersService, jwtService, refreshTokenModel) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.refreshTokenModel = refreshTokenModel;
    }
    async generateTokens(user) {
        const payload = { sub: user._id, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(40).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenModel.create({
            user: user._id,
            token: refreshToken,
            expiresAt,
        });
        return { accessToken, refreshToken };
    }
    async register(registerDto) {
        if (!registerDto.fullName && !registerDto.name) {
            throw new common_1.BadRequestException('Full name is required');
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
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        const isMatch = await user.comparePassword(loginDto.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Account is inactive');
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
    async refresh(refreshDto) {
        const tokenRecord = await this.refreshTokenModel
            .findOne({
            token: refreshDto.refreshToken,
            isRevoked: false,
            expiresAt: { $gt: new Date() },
        })
            .populate('user');
        if (!tokenRecord) {
            throw new common_1.UnauthorizedException('Invalid or expired refresh token');
        }
        const user = tokenRecord.user;
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('User account is inactive');
        }
        tokenRecord.isRevoked = true;
        await tokenRecord.save();
        const tokens = await this.generateTokens(user);
        return tokens;
    }
    async logout(refreshToken) {
        await this.refreshTokenModel.updateOne({ token: refreshToken }, { isRevoked: true });
        return { success: true, message: 'Logged out successfully' };
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            return {
                success: true,
                message: 'If the email exists, a reset link has been sent',
            };
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        console.log(`[MOCK EMAIL] Reset link for ${user.email}: http://localhost:3000/reset-password?token=${resetToken}`);
        return {
            success: true,
            message: 'If the email exists, a reset link has been sent',
        };
    }
    async resetPassword(resetPasswordDto) {
        if (resetPasswordDto.token.length < 10) {
            throw new common_1.BadRequestException('Invalid reset token');
        }
        return { success: true, message: 'Password reset successfully' };
    }
    async verifyEmail(email) {
        console.log(`[MOCK EMAIL] Verification link for ${email}: http://localhost:3000/verify-email`);
        return { success: true, message: 'Verification email sent' };
    }
    async changePassword(userId, changePasswordDto) {
        await this.usersService.changePassword(userId, changePasswordDto.oldPassword, changePasswordDto.newPassword);
        return { success: true, message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, mongoose_1.InjectModel)(refresh_token_schema_1.RefreshToken.name)),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map