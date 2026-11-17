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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
const category_schema_1 = require("../categories/schemas/category.schema");
const slugify_1 = __importDefault(require("slugify"));
let ProductsService = class ProductsService {
    productModel;
    categoryModel;
    constructor(productModel, categoryModel) {
        this.productModel = productModel;
        this.categoryModel = categoryModel;
    }
    async resolveCategoryId(categoryInput) {
        const trimmed = String(categoryInput || '').trim();
        if (!trimmed) {
            throw new common_1.BadRequestException('Category is required');
        }
        if ((0, mongoose_2.isValidObjectId)(trimmed)) {
            const existing = await this.categoryModel.findById(trimmed);
            if (existing) {
                return existing._id;
            }
            return new mongoose_2.Types.ObjectId(trimmed);
        }
        const escapedInput = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const normalizedSlug = (0, slugify_1.default)(trimmed, { lower: true, strict: true }) || trimmed.toLowerCase();
        let categoryDoc = await this.categoryModel.findOne({
            $or: [
                { slug: trimmed.toLowerCase() },
                { slug: normalizedSlug },
                { name: new RegExp(`^${escapedInput}$`, 'i') },
            ],
        });
        if (!categoryDoc) {
            categoryDoc = await this.categoryModel.findOne({
                name: new RegExp(escapedInput, 'i'),
            });
        }
        if (!categoryDoc) {
            const displayName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
            categoryDoc = await this.categoryModel.create({
                name: displayName,
                slug: normalizedSlug || `category-${Date.now()}`,
                isActive: true,
            });
        }
        return categoryDoc._id;
    }
    async create(ownerId, createProductDto) {
        const slug = (0, slugify_1.default)(`${createProductDto.name}-${Date.now()}`, {
            lower: true,
        });
        const categoryId = await this.resolveCategoryId(createProductDto.category);
        const createdProduct = new this.productModel({
            ...createProductDto,
            category: categoryId,
            owner: ownerId,
            slug,
            status: product_schema_1.ProductStatus.ACTIVE,
        });
        return createdProduct.save();
    }
    async findAll(query = {}) {
        const filter = { status: product_schema_1.ProductStatus.ACTIVE };
        if (query.category) {
            const catQuery = String(query.category).trim();
            let targetCategoryId = null;
            if ((0, mongoose_2.isValidObjectId)(catQuery)) {
                targetCategoryId = new mongoose_2.Types.ObjectId(catQuery);
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
            }
            else if (targetCategoryId) {
                filter.category = targetCategoryId;
            }
            else {
                filter.category = new mongoose_2.Types.ObjectId();
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
        const sortMap = {
            price_asc: { pricePerDay: 1 },
            price_desc: { pricePerDay: -1 },
            rating: { rating: -1 },
            newest: { createdAt: -1 },
        };
        const sort = sortMap[query.sort ?? ''] ?? {
            createdAt: -1,
        };
        const page = parseInt(String(query.page ?? '1')) || 1;
        const limit = parseInt(String(query.limit ?? '12')) || 12;
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
    async findById(id) {
        const product = await this.productModel
            .findById(id)
            .populate('category', 'name slug')
            .populate('owner', 'fullName avatar')
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async findByOwner(ownerId) {
        const ownerIdStr = String(ownerId);
        const ownerObjId = (0, mongoose_2.isValidObjectId)(ownerIdStr) ? new mongoose_2.Types.ObjectId(ownerIdStr) : null;
        const filter = ownerObjId
            ? { $or: [{ owner: ownerObjId }, { owner: ownerIdStr }] }
            : { owner: ownerIdStr };
        return this.productModel
            .find(filter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(id, userId, updateProductDto, userRole) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const productOwnerId = String(product.owner?._id || product.owner);
        const isAdmin = userRole === 'admin' || userRole === 'super_admin';
        if (!isAdmin && productOwnerId !== String(userId)) {
            throw new common_1.UnauthorizedException('You can only edit your own products');
        }
        const updateData = { ...updateProductDto };
        if (updateData.category) {
            updateData.category = await this.resolveCategoryId(updateData.category);
        }
        const updated = await this.productModel
            .findByIdAndUpdate(id, { $set: updateData }, { new: true })
            .populate('category', 'name slug')
            .populate('owner', 'fullName avatar')
            .exec();
        if (!updated) {
            throw new common_1.NotFoundException('Product not found after update');
        }
        return updated;
    }
    async remove(id, userId, userRole) {
        const product = await this.productModel.findById(id).exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        const productOwnerId = String(product.owner?._id || product.owner);
        const isAdmin = userRole === 'admin' || userRole === 'super_admin';
        if (!isAdmin && productOwnerId !== String(userId)) {
            throw new common_1.UnauthorizedException('You can only delete your own products');
        }
        await this.productModel.findByIdAndDelete(id).exec();
    }
    async setStatus(id, status) {
        const product = await this.findById(id);
        product.status = status;
        return product.save();
    }
    async countByOwner(ownerId) {
        return this.productModel.countDocuments({ owner: ownerId });
    }
    async countTotal() {
        return this.productModel.countDocuments({});
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map