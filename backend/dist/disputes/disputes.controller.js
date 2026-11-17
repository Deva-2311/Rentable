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
exports.DisputesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const disputes_service_1 = require("./disputes.service");
const create_dispute_dto_1 = require("./dto/create-dispute.dto");
const resolve_dispute_dto_1 = require("./dto/resolve-dispute.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let DisputesController = class DisputesController {
    disputesService;
    constructor(disputesService) {
        this.disputesService = disputesService;
    }
    async create(req, createDisputeDto) {
        const dispute = await this.disputesService.create(String(req.user._id), req.user.role, createDisputeDto);
        return {
            success: true,
            message: 'Dispute submitted successfully',
            data: dispute,
        };
    }
    async findAll(req) {
        const disputes = await this.disputesService.findAll(String(req.user._id), req.user.role);
        return {
            success: true,
            data: disputes,
        };
    }
    async findOne(req, id) {
        const dispute = await this.disputesService.findOne(id, String(req.user._id), req.user.role);
        return {
            success: true,
            data: dispute,
        };
    }
    async resolve(req, id, resolveDisputeDto) {
        const dispute = await this.disputesService.resolve(id, String(req.user._id), resolveDisputeDto);
        return {
            success: true,
            message: 'Dispute resolved successfully',
            data: dispute,
        };
    }
};
exports.DisputesController = DisputesController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Open a new dispute for a rental booking' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_dispute_dto_1.CreateDisputeDto]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all disputes for the current user (or all if admin)' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific dispute' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/resolve'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN, role_enum_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve a dispute (Admin only)' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, resolve_dispute_dto_1.ResolveDisputeDto]),
    __metadata("design:returntype", Promise)
], DisputesController.prototype, "resolve", null);
exports.DisputesController = DisputesController = __decorate([
    (0, swagger_1.ApiTags)('Disputes'),
    (0, common_1.Controller)('disputes'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [disputes_service_1.DisputesService])
], DisputesController);
//# sourceMappingURL=disputes.controller.js.map