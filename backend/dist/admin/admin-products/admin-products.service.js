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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("../../products/schemas/product.schema");
const audit_log_schema_1 = require("../../audit/schemas/audit-log.schema");
let AdminProductsService = class AdminProductsService {
    productModel;
    auditLogModel;
    constructor(productModel, auditLogModel) {
        this.productModel = productModel;
        this.auditLogModel = auditLogModel;
    }
    async getPendingProducts() {
        return this.productModel
            .find({ status: product_schema_1.ProductStatus.PENDING_APPROVAL })
            .populate('owner', 'fullName email')
            .sort({ createdAt: -1 })
            .exec();
    }
    async approveProduct(productId, adminId, adminRole) {
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const previousState = { status: product.status };
        product.status = product_schema_1.ProductStatus.ACTIVE;
        await product.save();
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            adminRole,
            action: 'PRODUCT_APPROVED',
            targetType: 'Product',
            targetId: new mongoose_2.Types.ObjectId(productId),
            previousState,
            newState: { status: product_schema_1.ProductStatus.ACTIVE },
        });
        return product;
    }
    async rejectProduct(productId, reason, adminId, adminRole) {
        const product = await this.productModel.findById(productId);
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const previousState = { status: product.status };
        product.status = product_schema_1.ProductStatus.REJECTED;
        await product.save();
        await this.auditLogModel.create({
            adminId: new mongoose_2.Types.ObjectId(adminId),
            adminRole,
            action: 'PRODUCT_REJECTED',
            targetType: 'Product',
            targetId: new mongoose_2.Types.ObjectId(productId),
            previousState,
            newState: { status: 'REJECTED' },
            reason,
        });
        return product;
    }
};
exports.AdminProductsService = AdminProductsService;
exports.AdminProductsService = AdminProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AdminProductsService);
//# sourceMappingURL=admin-products.service.js.map