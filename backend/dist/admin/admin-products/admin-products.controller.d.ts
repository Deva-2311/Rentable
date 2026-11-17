import { AdminProductsService } from './admin-products.service';
export declare class AdminProductsController {
    private readonly productsService;
    constructor(productsService: AdminProductsService);
    getPendingProducts(): Promise<{
        success: boolean;
        data: (import("mongoose").Document<unknown, {}, import("../../products/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        })[];
    }>;
    approveProduct(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../products/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
    rejectProduct(id: string, reason: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../../products/schemas/product.schema").ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../../products/schemas/product.schema").Product & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
