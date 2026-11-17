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
exports.RentalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rentals_service_1 = require("./rentals.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let RentalsController = class RentalsController {
    rentalsService;
    constructor(rentalsService) {
        this.rentalsService = rentalsService;
    }
    async getActive(req) {
        const isOwner = req.user.role === role_enum_1.UserRole.OWNER;
        return {
            success: true,
            data: await this.rentalsService.getActiveRentals(String(req.user._id), isOwner),
        };
    }
    async getHistory(req) {
        const isOwner = req.user.role === role_enum_1.UserRole.OWNER;
        return {
            success: true,
            data: await this.rentalsService.getHistory(String(req.user._id), isOwner),
        };
    }
    async getAll(req) {
        const isOwner = req.user.role === role_enum_1.UserRole.OWNER;
        return {
            success: true,
            data: await this.rentalsService.getAllRentals(String(req.user._id), isOwner),
        };
    }
    async findOne(id) {
        return {
            success: true,
            data: await this.rentalsService.findById(id),
        };
    }
    async requestReturn(req, id) {
        return {
            success: true,
            data: await this.rentalsService.requestReturn(id, String(req.user._id)),
        };
    }
    async completeRental(req, id) {
        return {
            success: true,
            data: await this.rentalsService.completeRental(id, String(req.user._id)),
        };
    }
};
exports.RentalsController = RentalsController;
__decorate([
    (0, common_1.Get)('active'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active rentals for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "getActive", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rental history for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rentals for the current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rental details by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(':id/return-request'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER),
    (0, swagger_1.ApiOperation)({ summary: 'Borrower requests to return the rental' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "requestReturn", null);
__decorate([
    (0, common_1.Patch)(':id/complete'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.OWNER),
    (0, swagger_1.ApiOperation)({ summary: 'Owner confirms return and completes rental' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RentalsController.prototype, "completeRental", null);
exports.RentalsController = RentalsController = __decorate([
    (0, swagger_1.ApiTags)('Rentals'),
    (0, common_1.Controller)('rentals'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [rentals_service_1.RentalsService])
], RentalsController);
//# sourceMappingURL=rentals.controller.js.map