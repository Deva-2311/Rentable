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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductSchema = exports.Product = exports.ProductStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ProductStatus;
(function (ProductStatus) {
    ProductStatus["DRAFT"] = "DRAFT";
    ProductStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    ProductStatus["ACTIVE"] = "ACTIVE";
    ProductStatus["PAUSED"] = "PAUSED";
    ProductStatus["REJECTED"] = "REJECTED";
    ProductStatus["REMOVED"] = "REMOVED";
})(ProductStatus || (exports.ProductStatus = ProductStatus = {}));
let Product = class Product {
    owner;
    name;
    slug;
    description;
    category;
    images;
    pricePerDay;
    securityDeposit;
    condition;
    location;
    availability;
    rentalRules;
    cancellationPolicy;
    status;
    rating;
    reviewCount;
};
exports.Product = Product;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Product.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Product.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }),
    __metadata("design:type", String)
], Product.prototype, "category", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "pricePerDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Product.prototype, "securityDeposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "condition", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Product.prototype, "location", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Product.prototype, "availability", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "rentalRules", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Product.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: ProductStatus, default: ProductStatus.PENDING_APPROVAL }),
    __metadata("design:type", String)
], Product.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "reviewCount", void 0);
exports.Product = Product = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Product);
exports.ProductSchema = mongoose_1.SchemaFactory.createForClass(Product);
//# sourceMappingURL=product.schema.js.map