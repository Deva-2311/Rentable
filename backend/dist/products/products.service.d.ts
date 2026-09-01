import { Model } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    create(ownerId: string, createProductDto: CreateProductDto): Promise<ProductDocument>;
    findAll(query?: any): Promise<{
        products: (import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
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
    update(id: string, ownerId: string, updateProductDto: UpdateProductDto): Promise<ProductDocument>;
    remove(id: string, ownerId: string): Promise<void>;
    setStatus(id: string, status: ProductStatus): Promise<ProductDocument>;
    countByOwner(ownerId: string): Promise<number>;
    countTotal(): Promise<number>;
}
