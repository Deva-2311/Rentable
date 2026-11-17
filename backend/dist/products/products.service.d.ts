import { Model, Types } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { CategoryDocument } from '../categories/schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
interface ProductQuery {
    category?: string;
    search?: string;
    minPrice?: string | number;
    maxPrice?: string | number;
    condition?: string;
    location?: string;
    sort?: string;
    page?: string | number;
    limit?: string | number;
}
export declare class ProductsService {
    private productModel;
    private categoryModel;
    constructor(productModel: Model<ProductDocument>, categoryModel: Model<CategoryDocument>);
    private resolveCategoryId;
    create(ownerId: string, createProductDto: CreateProductDto): Promise<ProductDocument>;
    findAll(query?: ProductQuery): Promise<{
        products: (import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findById(id: string): Promise<ProductDocument>;
    findByOwner(ownerId: string): Promise<ProductDocument[]>;
    update(id: string, userId: string, updateProductDto: UpdateProductDto, userRole?: string): Promise<ProductDocument>;
    remove(id: string, userId: string, userRole?: string): Promise<void>;
    setStatus(id: string, status: ProductStatus): Promise<ProductDocument>;
    countByOwner(ownerId: string): Promise<number>;
    countTotal(): Promise<number>;
}
export {};
