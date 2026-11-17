import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
interface CreateUserPayload {
    name?: string;
    fullName?: string;
    email: string;
    password: string;
    role?: string;
}
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(createUserDto: CreateUserPayload): Promise<UserDocument>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findById(id: string): Promise<UserDocument | null>;
    updateProfile(id: string, updateData: {
        name?: string;
        phone?: string;
        avatar?: string;
    }): Promise<UserDocument>;
    changePassword(id: string, oldPass: string, newPass: string): Promise<boolean>;
}
export {};
