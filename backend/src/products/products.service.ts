import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument, ProductStatus } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import slugify from 'slugify';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(ownerId: string, createProductDto: CreateProductDto): Promise<ProductDocument> {
    const slug = slugify(`${createProductDto.name}-${Date.now()}`, { lower: true });

    const createdProduct = new this.productModel({
      ...createProductDto,
      owner: ownerId,
      slug,
      status: ProductStatus.ACTIVE, // Auto-approve for MVP — admin can reject later
    });
    return createdProduct.save();
  }

  async findAll(query: any = {}) {
    const filter: any = { status: ProductStatus.ACTIVE };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
        { location: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.minPrice || query.maxPrice) {
      filter.pricePerDay = {};
      if (query.minPrice) filter.pricePerDay.$gte = Number(query.minPrice);
      if (query.maxPrice) filter.pricePerDay.$lte = Number(query.maxPrice);
    }

    if (query.condition) {
      filter.condition = { $in: query.condition.split(',') };
    }

    if (query.location) {
      filter.location = { $regex: query.location, $options: 'i' };
    }

    const sortMap: Record<string, any> = {
      price_asc: { pricePerDay: 1 },
      price_desc: { pricePerDay: -1 },
      rating: { rating: -1 },
      newest: { createdAt: -1 },
    };
    const sort = sortMap[query.sort] || { createdAt: -1 };

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.productModel
        .find(filter)
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
    return this.productModel
      .find({ owner: ownerId })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .exec();
  }

  async update(
    id: string,
    ownerId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    const product = await this.findById(id);

    if (String(product.owner) !== String(ownerId)) {
      throw new UnauthorizedException('You can only edit your own products');
    }

    Object.assign(product, updateProductDto);
    return product.save();
  }

  async remove(id: string, ownerId: string): Promise<void> {
    const product = await this.findById(id);
    if (String(product.owner) !== String(ownerId)) {
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
