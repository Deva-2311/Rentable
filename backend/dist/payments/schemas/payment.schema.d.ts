import { Document, Schema as MongooseSchema } from 'mongoose';
export type PaymentDocument = Payment & Document;
export declare enum PaymentMethod {
    RAZORPAY = "RAZORPAY"
}
export declare enum PaymentState {
    CREATED = "CREATED",
    PENDING = "PENDING",
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED"
}
export declare class Payment {
    booking: string;
    user: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    amount: number;
    currency: string;
    status: PaymentState;
    paymentMethod: PaymentMethod;
}
export declare const PaymentSchema: MongooseSchema<Payment, import("mongoose").Model<Payment, any, any, any, any, any, Payment>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Payment, Document<unknown, {}, Payment, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    booking?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    user?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    razorpayOrderId?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    razorpayPaymentId?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    amount?: import("mongoose").SchemaDefinitionProperty<number, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    currency?: import("mongoose").SchemaDefinitionProperty<string, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    status?: import("mongoose").SchemaDefinitionProperty<PaymentState, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
    paymentMethod?: import("mongoose").SchemaDefinitionProperty<PaymentMethod, Payment, Document<unknown, {}, Payment, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Payment & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>>;
}, Payment>;
