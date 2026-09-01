import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: any): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    
    // We map 'name' from frontend to 'fullName' in DB
    const createdUser = new this.userModel({
      fullName: createUserDto.name,
      email: createUserDto.email,
      password: createUserDto.password,
      role: createUserDto.role,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).select('-password').exec();
  }

  async updateProfile(id: string, updateData: any): Promise<UserDocument> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (updateData.name) {
      user.fullName = updateData.name;
    }
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.avatar) user.avatar = updateData.avatar;
    
    await user.save();
    return this.findById(id);
  }

  async changePassword(id: string, oldPass: string, newPass: string) {
    const user = await this.userModel.findById(id).select('+password');
    if (!user) throw new NotFoundException('User not found');
    
    const isMatch = await (user as any).comparePassword(oldPass);
    if (!isMatch) throw new BadRequestException('Incorrect old password');
    
    user.password = newPass;
    await user.save();
    return true;
  }
}
