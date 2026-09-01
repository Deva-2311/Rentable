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
const slugify_1 = __importDefault(require("slugify"));
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(ownerId, createProductDto) {
        const slug = (0, slugify_1.default)(`${createProductDto.name}-${Date.now()}`, { lower: true });
        const createdProduct = new this.productModel({
            ...createProductDto,
            owner: ownerId,
            slug,
            status: product_schema_1.ProductStatus.ACTIVE,
        });
        return createdProduct.save();
    }
    async findAll(query = {}) {
        const filter = { status: product_schema_1.ProductStatus.ACTIVE };
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
            if (query.minPrice)
                filter.pricePerDay.$gte = Number(query.minPrice);
            if (query.maxPrice)
                filter.pricePerDay.$lte = Number(query.maxPrice);
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
        return this.productModel
            .find({ owner: ownerId })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .exec();
    }
    async update(id, ownerId, updateProductDto) {
        const product = await this.findById(id);
        if (String(product.owner) !== String(ownerId)) {
            throw new common_1.UnauthorizedException('You can only edit your own products');
        }
        Object.assign(product, updateProductDto);
        return product.save();
    }
    async remove(id, ownerId) {
        const product = await this.findById(id);
        if (String(product.owner) !== String(ownerId)) {
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
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map