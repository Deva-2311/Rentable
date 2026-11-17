import { Model } from 'mongoose';
import { CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { ProductDocument } from '../products/schemas/product.schema';
export declare class CategoriesService {
    private categoryModel;
    private productModel;
    constructor(categoryModel: Model<CategoryDocument>, productModel: Model<ProductDocument>);
    create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument>;
    findAll(): Promise<CategoryDocument[]>;
    findBySlug(slug: string): Promise<CategoryDocument>;
    update(id: string, updateCategoryDto: any): Promise<CategoryDocument>;
    remove(id: string): Promise<void>;
}
