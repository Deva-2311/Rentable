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
exports.CategoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const categories_service_1 = require("./categories.service");
const create_category_dto_1 = require("./dto/create-category.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const audit_log_schema_1 = require("../audit/schemas/audit-log.schema");
let CategoriesController = class CategoriesController {
    categoriesService;
    auditLogModel;
    constructor(categoriesService, auditLogModel) {
        this.categoriesService = categoriesService;
        this.auditLogModel = auditLogModel;
    }
    async create(createCategoryDto, req) {
        const category = await this.categoriesService.create(createCategoryDto);
        if (req.user) {
            await this.auditLogModel.create({
                adminId: new mongoose_2.Types.ObjectId(String(req.user._id)),
                adminRole: req.user.role,
                action: 'CATEGORY_CREATED',
                targetType: 'Category',
                targetId: category._id,
                newState: {
                    name: category.name,
                    slug: category.slug,
                    description: category.description,
                    image: category.image,
                    isActive: category.isActive,
                },
                reason: 'Admin created category',
            });
        }
        return {
            success: true,
            data: category,
        };
    }
    async findAll() {
        return {
            success: true,
            data: await this.categoriesService.findAll(),
        };
    }
    async findOne(slug) {
        return {
            success: true,
            data: await this.categoriesService.findBySlug(slug),
        };
    }
    async update(id, updateCategoryDto, req) {
        const category = await this.categoriesService.update(id, updateCategoryDto);
        if (req.user) {
            await this.auditLogModel.create({
                adminId: new mongoose_2.Types.ObjectId(String(req.user._id)),
                adminRole: req.user.role,
                action: 'CATEGORY_UPDATED',
                targetType: 'Category',
                targetId: category._id,
                newState: updateCategoryDto,
                reason: 'Admin updated category',
            });
        }
        return {
            success: true,
            data: category,
        };
    }
    async remove(id, req) {
        await this.categoriesService.remove(id);
        if (req.user) {
            await this.auditLogModel.create({
                adminId: new mongoose_2.Types.ObjectId(String(req.user._id)),
                adminRole: req.user.role,
                action: 'CATEGORY_DELETED',
                targetType: 'Category',
                targetId: new mongoose_2.Types.ObjectId(id),
                reason: 'Admin removed category',
            });
        }
        return {
            success: true,
            message: 'Category removed successfully',
        };
    }
};
exports.CategoriesController = CategoriesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new category (Admin only)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all active categories' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':slug'),
    (0, swagger_1.ApiOperation)({ summary: 'Get category by slug' }),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update a category (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a category (Admin only)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "remove", null);
exports.CategoriesController = CategoriesController = __decorate([
    (0, swagger_1.ApiTags)('Categories'),
    (0, common_1.Controller)('categories'),
    __param(1, (0, mongoose_1.InjectModel)(audit_log_schema_1.AuditLog.name)),
    __metadata("design:paramtypes", [categories_service_1.CategoriesService,
        mongoose_2.Model])
], CategoriesController);
//# sourceMappingURL=categories.controller.js.map