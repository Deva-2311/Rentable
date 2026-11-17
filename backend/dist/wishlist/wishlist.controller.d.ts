import type { AuthenticatedRequest } from '../common/interfaces/authenticated-request.interface';
import { WishlistService } from './wishlist.service';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(req: AuthenticatedRequest): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
    addProduct(req: AuthenticatedRequest, productId: string): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
    removeProduct(req: AuthenticatedRequest, productId: string): Promise<{
        success: boolean;
        data: import("./schemas/wishlist.schema").WishlistDocument;
    }>;
}
