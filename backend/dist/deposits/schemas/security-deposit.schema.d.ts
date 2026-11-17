import { Document, Types } from 'mongoose';
export type SecurityDepositDocument = SecurityDeposit & Document;
export declare enum DepositStatus {
    HELD = "HELD",
    RELEASE_PENDING = "RELEASE_PENDING",
    RELEASED = "RELEASED",
    PARTIALLY_DEDUCTED = "PARTIALLY_DEDUCTED",
    FULLY_DEDUCTED = "FULLY_DEDUCTED",
    DISPUTED = "DISPUTED"
}
export declare class SecurityDeposit {
    booking: Types.ObjectId;
    borrower: Types.ObjectId;
    owner: Types.ObjectId;
    amount: number;
    status: DepositStatus;
    originalPaymentId?: Types.ObjectId;
    deductions: {
        amount: number;
        reason: string;
        evidenceUrls?: string[];
        deductedBy: Types.ObjectId;
        deductedAt: Date;
    }[];
    totalDeducted: number;
    releasedAt?: Date;
    gatewayRefundId?: string;
}
export declare const SecurityDepositSchema: import("mongoose").Schema<SecurityDeposit, import("mongoose").Model<SecurityDeposit, any, any, any, any, any, SecurityDeposit>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    booking?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    borrower?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    owner?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    amount?: import("mongoose").SchemaDefinitionProperty<number, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<DepositStatus, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    originalPaymentId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    deductions?: import("mongoose").SchemaDefinitionProperty<{
        amount: number;
        reason: string;
        evidenceUrls?: string[];
        deductedBy: Types.ObjectId;
        deductedAt: Date;
    }[], SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    totalDeducted?: import("mongoose").SchemaDefinitionProperty<number, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    releasedAt?: import("mongoose").SchemaDefinitionProperty<Date, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    gatewayRefundId?: import("mongoose").SchemaDefinitionProperty<string, SecurityDeposit, Document<unknown, {}, SecurityDeposit, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<SecurityDeposit & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, SecurityDeposit>;
