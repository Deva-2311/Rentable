import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
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
    update(id: string, updateCategoryDto: any): Promise<{
        success: boolean;
        data: import("./schemas/category.schema").CategoryDocument;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
