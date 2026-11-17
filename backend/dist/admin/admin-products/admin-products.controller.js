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
exports.AdminProductsController = void 0;
const common_1 = require("@nestjs/common");
const admin_products_service_1 = require("./admin-products.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const permissions_guard_1 = require("../../common/guards/permissions.guard");
const permissions_decorator_1 = require("../../common/decorators/permissions.decorator");
const permission_enum_1 = require("../../common/enums/permission.enum");
let AdminProductsController = class AdminProductsController {
    productsService;
    constructor(productsService) {
        this.productsService = productsService;
    }
    async getPendingProducts() {
        const products = await this.productsService.getPendingProducts();
        return { success: true, data: products };
    }
    async approveProduct(id, req) {
        const adminId = String(req.user._id || req.user.id);
        const product = await this.productsService.approveProduct(id, adminId, req.user.role);
        return {
            success: true,
            message: 'Product approved successfully',
            data: product,
        };
    }
    async rejectProduct(id, reason, req) {
        const adminId = String(req.user._id || req.user.id);
        const product = await this.productsService.rejectProduct(id, reason, adminId, req.user.role);
        return { success: true, message: 'Product rejected', data: product };
    }
};
exports.AdminProductsController = AdminProductsController;
__decorate([
    (0, common_1.Get)('pending'),
    (0, permissions_decorator_1.Permissions)(permission_enum_1.Permission.PRODUCTS_READ),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "getPendingProducts", null);
__decorate([
    (0, common_1.Patch)(':id/approve'),
    (0, permissions_decorator_1.Permissions)(permission_enum_1.Permission.PRODUCTS_APPROVE),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "approveProduct", null);
__decorate([
    (0, common_1.Patch)(':id/reject'),
    (0, permissions_decorator_1.Permissions)(permission_enum_1.Permission.PRODUCTS_REJECT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('reason')),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminProductsController.prototype, "rejectProduct", null);
exports.AdminProductsController = AdminProductsController = __decorate([
    (0, common_1.Controller)('admin/products'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard),
    __metadata("design:paramtypes", [admin_products_service_1.AdminProductsService])
], AdminProductsController);
//# sourceMappingURL=admin-products.controller.js.map