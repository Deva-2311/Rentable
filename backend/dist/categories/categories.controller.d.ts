import { Model } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { AuditLogDocument } from '../audit/schemas/audit-log.schema';
import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
export declare class CategoriesController {
    private readonly categoriesService;
    private auditLogModel;
    constructor(categoriesService: CategoriesService, auditLogModel: Model<AuditLogDocument>);
    create(createCategoryDto: CreateCategoryDto, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").CategoryDocument;
    }>;
    findAll(): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").CategoryDocument[];
    }>;
    findOne(slug: string): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").CategoryDocument;
    }>;
    update(id: string, updateCategoryDto: any, req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").CategoryDocument;
    }>;
    remove(id: string, req: AuthenticatedRequest): Promise<{
        success: boolean;
        message: string;
    }>;
}
