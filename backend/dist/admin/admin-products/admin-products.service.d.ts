import { Model, Types } from 'mongoose';
import { Product, ProductDocument } from '../../products/schemas/product.schema';
import { AuditLogDocument } from '../../audit/schemas/audit-log.schema';
export declare class AdminProductsService {
    private productModel;
    private auditLogModel;
    constructor(productModel: Model<ProductDocument>, auditLogModel: Model<AuditLogDocument>);
    getPendingProducts(): Promise<(import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    approveProduct(productId: string, adminId: string, adminRole: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    rejectProduct(productId: string, reason: string, adminId: string, adminRole: string): Promise<import("mongoose").Document<unknown, {}, ProductDocument, {}, import("mongoose").DefaultSchemaOptions> & Product & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
