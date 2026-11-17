"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const category_schema_1 = require("./schemas/category.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const slugify_1 = __importDefault(require("slugify"));
let CategoriesService = class CategoriesService {
    categoryModel;
    productModel;
    constructor(categoryModel, productModel) {
        this.categoryModel = categoryModel;
        this.productModel = productModel;
    }
    async create(createCategoryDto) {
        const rawSlug = createCategoryDto.slug || createCategoryDto.name;
        const cleanSlug = (0, slugify_1.default)(rawSlug.replace(/^\/+/, ''), { lower: true, strict: true });
        const existingSlug = await this.categoryModel.findOne({ slug: cleanSlug });
        if (existingSlug) {
            throw new common_1.ConflictException(`A category with slug '${cleanSlug}' already exists`);
        }
        const createdCategory = new this.categoryModel({
            ...createCategoryDto,
            slug: cleanSlug,
        });
        return createdCategory.save();
    }
    async findAll() {
        return this.categoryModel.find().sort({ name: 1 }).exec();
    }
    async findBySlug(slug) {
        const category = await this.categoryModel
            .findOne({ slug, isActive: true })
            .exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with slug '${slug}' not found`);
        }
        return category;
    }
    async update(id, updateCategoryDto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid category ID format');
        }
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found`);
        }
        if (updateCategoryDto.slug) {
            const cleanSlug = (0, slugify_1.default)(updateCategoryDto.slug.replace(/^\/+/, ''), { lower: true, strict: true });
            const duplicate = await this.categoryModel.findOne({
                slug: cleanSlug,
                _id: { $ne: new mongoose_2.Types.ObjectId(id) },
            });
            if (duplicate) {
                throw new common_1.ConflictException(`A category with slug '${cleanSlug}' already exists`);
            }
            updateCategoryDto.slug = cleanSlug;
        }
        Object.assign(category, updateCategoryDto);
        return category.save();
    }
    async remove(id) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid category ID format');
        }
        const category = await this.categoryModel.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID '${id}' not found`);
        }
        const referencingProductsCount = await this.productModel.countDocuments({
            category: id,
            status: { $ne: product_schema_1.ProductStatus.REMOVED },
        });
        if (referencingProductsCount > 0) {
            throw new common_1.BadRequestException(`Cannot delete category "${category.name}" because ${referencingProductsCount} product(s) currently reference it. Reassign or remove these products first, or mark the category as inactive.`);
        }
        await this.categoryModel.findByIdAndDelete(id);
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map