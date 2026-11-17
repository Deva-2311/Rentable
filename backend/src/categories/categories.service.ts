import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Product, ProductDocument, ProductStatus } from '../products/schemas/product.schema';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDocument> {
    // Auto-generate slug if not provided, or clean the provided slug
    const rawSlug = createCategoryDto.slug || createCategoryDto.name;
    const cleanSlug = slugify(rawSlug.replace(/^\/+/, ''), { lower: true, strict: true });

    // Check for duplicate slug
    const existingSlug = await this.categoryModel.findOne({ slug: cleanSlug });
    if (existingSlug) {
      throw new ConflictException(`A category with slug '${cleanSlug}' already exists`);
    }

    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      slug: cleanSlug,
    });
    return createdCategory.save();
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find().sort({ name: 1 }).exec();
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({ slug, isActive: true })
      .exec();
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: any): Promise<CategoryDocument> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // If slug is being updated, clean and verify uniqueness
    if (updateCategoryDto.slug) {
      const cleanSlug = slugify(updateCategoryDto.slug.replace(/^\/+/, ''), { lower: true, strict: true });
      const duplicate = await this.categoryModel.findOne({
        slug: cleanSlug,
        _id: { $ne: new Types.ObjectId(id) },
      });
      if (duplicate) {
        throw new ConflictException(`A category with slug '${cleanSlug}' already exists`);
      }
      updateCategoryDto.slug = cleanSlug;
    }

    Object.assign(category, updateCategoryDto);
    return category.save();
  }

  async remove(id: string): Promise<void> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid category ID format');
    }

    const category = await this.categoryModel.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }

    // Referential integrity check: verify if any products reference this category
    const referencingProductsCount = await this.productModel.countDocuments({
      category: id as any,
      status: { $ne: ProductStatus.REMOVED },
    });

    if (referencingProductsCount > 0) {
      throw new BadRequestException(
        `Cannot delete category "${category.name}" because ${referencingProductsCount} product(s) currently reference it. Reassign or remove these products first, or mark the category as inactive.`
      );
    }

    await this.categoryModel.findByIdAndDelete(id);
  }
}
