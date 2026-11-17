import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/user.schema").UserDocument;
    }>;
    updateProfile(req: AuthenticatedRequest, updateUserDto: UpdateUserDto): Promise<{
        success: boolean;
        data: import("./schemas/user.schema").UserDocument;
        message: string;
    }>;
    getUserById(id: string): Promise<{
        success: boolean;
        data: import("./schemas/user.schema").UserDocument;
    }>;
}
