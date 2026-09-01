import { Document, Schema as MongooseSchema } from 'mongoose';
export type WishlistDocument = Wishlist & Document;
export declare class Wishlist {
    user: string;
    products: string[];
}
export declare const WishlistSchema: MongooseSchema<Wishlist, import("mongoose").Model<Wishlist, any, any, any, any, any, Wishlist>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Wishlist, Document<unknown, {}, Wishlist, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    user?: import("mongoose").SchemaDefinitionProperty<string, Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    products?: import("mongoose").SchemaDefinitionProperty<string[], Wishlist, Document<unknown, {}, Wishlist, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Wishlist & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Wishlist>;
