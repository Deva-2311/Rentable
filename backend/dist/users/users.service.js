"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
let UsersService = class UsersService {
    userModel;
    constructor(userModel) {
        this.userModel = userModel;
    }
    async create(createUserDto) {
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new common_1.BadRequestException('User with this email already exists');
        }
        const createdUser = new this.userModel({
            fullName: createUserDto.name,
            email: createUserDto.email,
            password: createUserDto.password,
            role: createUserDto.role,
        });
        return createdUser.save();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).select('+password').exec();
    }
    async findById(id) {
        return this.userModel.findById(id).select('-password').exec();
    }
    async updateProfile(id, updateData) {
        const user = await this.userModel.findById(id);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (updateData.name) {
            user.fullName = updateData.name;
        }
        if (updateData.phone)
            user.phone = updateData.phone;
        if (updateData.avatar)
            user.avatar = updateData.avatar;
        await user.save();
        return this.findById(id);
    }
    async changePassword(id, oldPass, newPass) {
        const user = await this.userModel.findById(id).select('+password');
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const isMatch = await user.comparePassword(oldPass);
        if (!isMatch)
            throw new common_1.BadRequestException('Incorrect old password');
        user.password = newPass;
        await user.save();
        return true;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map