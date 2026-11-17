import { Document, Types } from 'mongoose';
export type PromotionDocument = Promotion & Document;
export declare enum PromotionType {
    FEATURED_PRODUCT = "FEATURED_PRODUCT",
    HOMEPAGE_BANNER = "HOMEPAGE_BANNER",
    COLLECTION = "COLLECTION",
    SEASONAL_CAMPAIGN = "SEASONAL_CAMPAIGN"
}
export declare class Promotion {
    title: string;
    description?: string;
    type: PromotionType;
    imageUrl?: string;
    targetUrl?: string;
    featuredProducts?: Types.ObjectId[];
    targetCategory?: Types.ObjectId;
    targetLocation?: string;
    isActive: boolean;
    startDate?: Date;
    endDate?: Date;
    createdBy: Types.ObjectId;
}
export declare const PromotionSchema: import("mongoose").Schema<Promotion, import("mongoose").Model<Promotion, any, any, any, any, any, Promotion>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Promotion, Document<unknown, {}, Promotion, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    title?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    description?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    type?: import("mongoose").SchemaDefinitionProperty<PromotionType, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    imageUrl?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetUrl?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    featuredProducts?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId[], Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetCategory?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    targetLocation?: import("mongoose").SchemaDefinitionProperty<string, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    isActive?: import("mongoose").SchemaDefinitionProperty<boolean, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    createdBy?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Promotion, Document<unknown, {}, Promotion, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Promotion & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Promotion>;
