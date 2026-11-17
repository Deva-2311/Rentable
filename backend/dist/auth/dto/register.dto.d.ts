import { UserRole } from '../../common/enums/role.enum';
export declare class RegisterDto {
    name?: string;
    fullName?: string;
    email: string;
    password: string;
    role: UserRole;
}
