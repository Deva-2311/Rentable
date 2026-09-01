import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
export type RefreshTokenDocument = RefreshToken & Document;
export declare class RefreshToken {
    user: User;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
}
export declare const RefreshTokenSchema: MongooseSchema<RefreshToken, import("mongoose").Model<RefreshToken, any, any, any, any, any, RefreshToken>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RefreshToken, Document<unknown, {}, RefreshToken, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    user?: import("mongoose").SchemaDefinitionProperty<User, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    token?: import("mongoose").SchemaDefinitionProperty<string, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    isRevoked?: import("mongoose").SchemaDefinitionProperty<boolean, RefreshToken, Document<unknown, {}, RefreshToken, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<RefreshToken & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, RefreshToken>;
