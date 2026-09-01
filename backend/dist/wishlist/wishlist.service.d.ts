import { Model } from 'mongoose';
import { WishlistDocument } from './schemas/wishlist.schema';
export declare class WishlistService {
    private wishlistModel;
    constructor(wishlistModel: Model<WishlistDocument>);
    getWishlist(userId: string): Promise<WishlistDocument>;
    addProduct(userId: string, productId: string): Promise<WishlistDocument>;
    removeProduct(userId: string, productId: string): Promise<WishlistDocument>;
}
