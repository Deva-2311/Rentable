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
exports.PromotionSchema = exports.Promotion = exports.PromotionType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var PromotionType;
(function (PromotionType) {
    PromotionType["FEATURED_PRODUCT"] = "FEATURED_PRODUCT";
    PromotionType["HOMEPAGE_BANNER"] = "HOMEPAGE_BANNER";
    PromotionType["COLLECTION"] = "COLLECTION";
    PromotionType["SEASONAL_CAMPAIGN"] = "SEASONAL_CAMPAIGN";
})(PromotionType || (exports.PromotionType = PromotionType = {}));
let Promotion = class Promotion {
    title;
    description;
    type;
    imageUrl;
    targetUrl;
    featuredProducts;
    targetCategory;
    targetLocation;
    isActive;
    startDate;
    endDate;
    createdBy;
};
exports.Promotion = Promotion;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Promotion.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(PromotionType),
        required: true,
    }),
    __metadata("design:type", String)
], Promotion.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "imageUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "targetUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Product' }] }),
    __metadata("design:type", Array)
], Promotion.prototype, "featuredProducts", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Category' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Promotion.prototype, "targetCategory", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Promotion.prototype, "targetLocation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Promotion.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Promotion.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Promotion.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Promotion.prototype, "createdBy", void 0);
exports.Promotion = Promotion = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Promotion);
exports.PromotionSchema = mongoose_1.SchemaFactory.createForClass(Promotion);
//# sourceMappingURL=promotion.schema.js.map