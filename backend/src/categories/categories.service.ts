import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import slugify from 'slugify';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    // Auto-generate slug if not provided
    const slug = createCategoryDto.slug
      ? createCategoryDto.slug
      : slugify(createCategoryDto.name, { lower: true, strict: true });

    const createdCategory = new this.categoryModel({
      ...createCategoryDto,
      slug,
    });
    return createdCategory.save();
  }

  async findAll(): Promise<CategoryDocument[]> {
    return this.categoryModel.find({ isActive: true }).exec();
  }

  async findBySlug(slug: string): Promise<CategoryDocument> {
    const category = await this.categoryModel.findOne({ slug, isActive: true }).exec();
    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }
    return category;
  }

  async update(id: string, updateCategoryDto: any): Promise<CategoryDocument> {
    const category = await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
    if (!category) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
    return category;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException(`Category with ID '${id}' not found`);
    }
  }
}
