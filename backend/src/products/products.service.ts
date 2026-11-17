import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder, Types, isValidObjectId } from 'mongoose';
import {
  Product,
  ProductDocument,
  ProductStatus,
} from './schemas/product.schema';
import {
  Category,
  CategoryDocument,
} from '../categories/schemas/category.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';

interface ProductQuery {
  category?: string;
  search?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  condition?: string;
  location?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
}

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  private async resolveCategoryId(
    categoryInput: string,
  ): Promise<Types.ObjectId> {
    const trimmed = String(categoryInput || '').trim();
    if (!trimmed) {
      throw new BadRequestException('Category is required');
    }

    // 1. If it's already an ObjectId, verify it exists or return it
    if (isValidObjectId(trimmed)) {
      const existing = await this.categoryModel.findById(trimmed);
      if (existing) {
        return existing._id as Types.ObjectId;
      }
      return new Types.ObjectId(trimmed);
    }

    // 2. Try looking up by slug or exact name (case-insensitive)
    const escapedInput = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const normalizedSlug =
      slugify(trimmed, { lower: true, strict: true }) || trimmed.toLowerCase();

    let categoryDoc = await this.categoryModel.findOne({
      $or: [
        { slug: trimmed.toLowerCase() },
        { slug: normalizedSlug },
        { name: new RegExp(`^${escapedInput}$`, 'i') },
      ],
    });

    // 3. If still not found, check partial name match
    if (!categoryDoc) {
      categoryDoc = await this.categoryModel.findOne({
        name: new RegExp(escapedInput, 'i'),
      });
    }

    // 4. If still not found, auto-create the category so product creation does not fail
    if (!categoryDoc) {
      const displayName =
        trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      categoryDoc = await this.categoryModel.create({
        name: displayName,
        slug: normalizedSlug || `category-${Date.now()}`,
        isActive: true,
      });
    }

    return categoryDoc._id as Types.ObjectId;
  }

  async create(
    ownerId: string,
    createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    const slug = slugify(`${createProductDto.name}-${Date.now()}`, {
      lower: true,
    });

    const categoryId = await this.resolveCategoryId(createProductDto.category);

    const createdProduct = new this.productModel({
      ...createProductDto,
      category: categoryId,
      owner: ownerId,
      slug,
      status: ProductStatus.ACTIVE, // Auto-approve for MVP — admin can reject later
    });
    return createdProduct.save();
  }

  async findAll(query: ProductQuery = {}) {
    const filter: Record<string, unknown> = { status: ProductStatus.ACTIVE };

    if (query.category) {
      const catQuery = String(query.category).trim();
      let targetCategoryId: Types.ObjectId | null = null;
      if (isValidObjectId(catQuery)) {
        targetCategoryId = new Types.ObjectId(catQuery);
      }

      const categoryDoc = await this.categoryModel.findOne({
        $or: [
          ...(targetCategoryId ? [{ _id: targetCategoryId }] : []),
          { slug: catQuery.toLowerCase() },
          { name: new RegExp(`^${catQuery}$`, 'i') },
        ],
      });

      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else if (targetCategoryId) {
        filter.category = targetCategoryId;
      } else {
        filter.category = new Types.ObjectId();
      }
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { location: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      filter.pricePerDay = {
        ...(query.minPrice ? { $gte: Number(query.minPrice) } : {}),
        ...(query.maxPrice ? { $lte: Number(query.maxPrice) } : {}),
      };
    }

    if (query.condition) {
      filter.condition = { $in: query.condition.split(',') };
    }

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    const sortMap: Record<string, Record<string, SortOrder>> = {
      price_asc: { pricePerDay: 1 },
      price_desc: { pricePerDay: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sort: Record<string, SortOrder> = sortMap[query.sort ?? ''] ?? {
      createdAt: -1,
    };

    const page = parseInt(String(query.page ?? '1')) || 1;
    const limit = parseInt(String(query.limit ?? '12')) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        .find(filter as any)
        .populate('category', 'name slug')
        .populate('owner', 'fullName avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.productModel.countDocuments(filter),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel
      .findById(id)
      .populate('category', 'name slug')
      .populate('owner', 'fullName avatar')
      .exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByOwner(ownerId: string): Promise<ProductDocument[]> {
    const ownerIdStr = String(ownerId);
    const ownerObjId = isValidObjectId(ownerIdStr) ? new Types.ObjectId(ownerIdStr) : null;
    const filter = ownerObjId
      ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] }
      : { owner: ownerIdStr };

    return this.productModel
      .find(filter as any)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    userId: string,
    updateProductDto: UpdateProductDto,
    userRole?: string,
  ): Promise<ProductDocument> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productOwnerId = String((product.owner as any)?._id || product.owner);

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    if (!isAdmin && productOwnerId !== String(userId)) {
      throw new UnauthorizedException('You can only edit your own products');
    }

    const updateData: any = { ...updateProductDto };
    if (updateData.category) {
      updateData.category = await this.resolveCategoryId(updateData.category);
    }

    const updated = await this.productModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .populate('category', 'name slug')
      .populate('owner', 'fullName avatar')
      .exec();

    if (!updated) {
      throw new NotFoundException('Product not found after update');
    }
    return updated;
  }

  async remove(id: string, userId: string, userRole?: string): Promise<void> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const productOwnerId = String((product.owner as any)?._id || product.owner);

    const isAdmin = userRole === 'admin' || userRole === 'super_admin';
    if (!isAdmin && productOwnerId !== String(userId)) {
      throw new UnauthorizedException('You can only delete your own products');
    }

    await this.productModel.findByIdAndDelete(id).exec();
  }

  /** Admin-only: approve or reject a product */
  async setStatus(id: string, status: ProductStatus): Promise<ProductDocument> {
    const product = await this.findById(id);
    product.status = status;
    return product.save();
  }

  /** Count documents for dashboard stats */
  async countByOwner(ownerId: string): Promise<number> {
    return this.productModel.countDocuments({ owner: ownerId });
  }

  async countTotal(): Promise<number> {
    return this.productModel.countDocuments({});
  }
}
