import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async getWishlist(userId: string): Promise<WishlistDocument> {
    let wishlist = await this.wishlistModel.findOne({ user: userId }).populate('products').exec();
    if (!wishlist) {
      wishlist = await new this.wishlistModel({ user: userId, products: [] }).save();
    }
    return wishlist;
  }

  async addProduct(userId: string, productId: string): Promise<WishlistDocument> {
    const wishlist = await this.getWishlist(userId);
    if (!wishlist.products.includes(productId as any)) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }
    return wishlist.populate('products');
  }

  async removeProduct(userId: string, productId: string): Promise<WishlistDocument> {
    const wishlist = await this.getWishlist(userId);
    wishlist.products = wishlist.products.filter((id) => id.toString() !== productId);
    await wishlist.save();
    return wishlist.populate('products');
  }
}
