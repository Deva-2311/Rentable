import { Model } from 'mongoose';
import { CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
export declare class CategoriesService {
    private categoryModel;
    constructor(categoryModel: Model<CategoryDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument>;
    findAll(): Promise<CategoryDocument[]>;
    findBySlug(slug: string): Promise<CategoryDocument>;
    update(id: string, updateCategoryDto: any): Promise<CategoryDocument>;
    remove(id: string): Promise<void>;
}
