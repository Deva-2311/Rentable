import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './schemas/product.schema';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(req: AuthenticatedRequest, createProductDto: CreateProductDto): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").ProductDocument;
    }>;
    findAll(query: any): Promise<{
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
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
    findMyProducts(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").ProductDocument[];
    }>;
    checkAvailability(id: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: {
            available: boolean;
        };
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").ProductDocument;
    }>;
    update(req: AuthenticatedRequest, id: string, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").ProductDocument;
    }>;
    setStatus(id: string, status: ProductStatus): Promise<{
        success: boolean;
        data: import("./schemas/product.schema").ProductDocument;
    }>;
    remove(req: AuthenticatedRequest, id: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
