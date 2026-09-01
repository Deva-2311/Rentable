import { Document, Schema as MongooseSchema } from 'mongoose';
export type RentalDocument = Rental & Document;
export declare enum RentalStatus {
    UPCOMING = "UPCOMING",
    ACTIVE = "ACTIVE",
    RETURN_REQUESTED = "RETURN_REQUESTED",
    RETURNED = "RETURNED",
    COMPLETED = "COMPLETED"
}
export declare class Rental {
    booking: string;
    product: string;
    borrower: string;
    owner: string;
    startDate: Date;
    endDate: Date;
    status: RentalStatus;
    returnRequestedAt?: Date;
    returnedAt?: Date;
    completedAt?: Date;
}
export declare const RentalSchema: MongooseSchema<Rental, import("mongoose").Model<Rental, any, any, any, any, any, Rental>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Rental, Document<unknown, {}, Rental, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    booking?: import("mongoose").SchemaDefinitionProperty<string, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    product?: import("mongoose").SchemaDefinitionProperty<string, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    borrower?: import("mongoose").SchemaDefinitionProperty<string, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    owner?: import("mongoose").SchemaDefinitionProperty<string, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    startDate?: import("mongoose").SchemaDefinitionProperty<Date, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    endDate?: import("mongoose").SchemaDefinitionProperty<Date, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<RentalStatus, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    returnRequestedAt?: import("mongoose").SchemaDefinitionProperty<Date, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    returnedAt?: import("mongoose").SchemaDefinitionProperty<Date, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    completedAt?: import("mongoose").SchemaDefinitionProperty<Date, Rental, Document<unknown, {}, Rental, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Rental & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Rental>;
