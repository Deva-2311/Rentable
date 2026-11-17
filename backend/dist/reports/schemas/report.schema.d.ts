import { Document, Types } from 'mongoose';
export type ReportDocument = Report & Document;
export declare enum ReportStatus {
    OPEN = "OPEN",
    INVESTIGATING = "INVESTIGATING",
    RESOLVED = "RESOLVED",
    DISMISSED = "DISMISSED"
}
export declare enum ReportTargetType {
    USER = "USER",
    PRODUCT = "PRODUCT",
    REVIEW = "REVIEW"
}
export declare enum ReportPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    CRITICAL = "CRITICAL"
}
export declare class Report {
    reporter: Types.ObjectId;
    targetType: ReportTargetType;
    targetId: Types.ObjectId;
    reason: string;
    description?: string;
    priority: ReportPriority;
    status: ReportStatus;
    assignedAdmin?: Types.ObjectId;
}
export declare const ReportSchema: import("mongoose").Schema<Report, import("mongoose").Model<Report, any, any, any, any, any, Report>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Report, Document<unknown, {}, Report, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    reporter?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetType?: import("mongoose").SchemaDefinitionProperty<ReportTargetType, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reason?: import("mongoose").SchemaDefinitionProperty<string, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    priority?: import("mongoose").SchemaDefinitionProperty<ReportPriority, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<ReportStatus, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    assignedAdmin?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Report, Document<unknown, {}, Report, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Report & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Report>;
