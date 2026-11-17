import { Document, Types } from 'mongoose';
export type DisputeDocument = Dispute & Document;
export declare enum DisputeStatus {
    OPENED = "OPENED",
    UNDER_REVIEW = "UNDER_REVIEW",
    EVIDENCE_REQUESTED = "EVIDENCE_REQUESTED",
    MEDIATION = "MEDIATION",
    RESOLVED = "RESOLVED",
    ESCALATED = "ESCALATED",
    CLOSED = "CLOSED"
}
export declare class Dispute {
    booking: Types.ObjectId;
    openedBy: Types.ObjectId;
    targetUser: Types.ObjectId;
    product: Types.ObjectId;
    reason: string;
    description: string;
    status: DisputeStatus;
    evidenceUrls: string[];
    assignedAdmin?: Types.ObjectId;
    resolution?: {
        action: string;
        amount?: number;
        reason: string;
        resolvedAt: Date;
        resolvedBy: Types.ObjectId;
    };
}
export declare const DisputeSchema: import("mongoose").Schema<Dispute, import("mongoose").Model<Dispute, any, any, any, any, any, Dispute>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Dispute, Document<unknown, {}, Dispute, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    booking?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    openedBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetUser?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    product?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    reason?: import("mongoose").SchemaDefinitionProperty<string, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<DisputeStatus, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    evidenceUrls?: import("mongoose").SchemaDefinitionProperty<string[], Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    assignedAdmin?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    resolution?: import("mongoose").SchemaDefinitionProperty<{
        action: string;
        amount?: number;
        reason: string;
        resolvedAt: Date;
        resolvedBy: Types.ObjectId;
    }, Dispute, Document<unknown, {}, Dispute, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Dispute & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Dispute>;
