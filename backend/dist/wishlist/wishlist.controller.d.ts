import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: any): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
    addProduct(req: any, productId: string): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
    removeProduct(req: any, productId: string): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
}
