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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const payment_dto_1 = require("./dto/payment.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async createOrder(req, createPaymentDto) {
        return {
            success: true,
            data: await this.paymentsService.createOrder(String(req.user._id), createPaymentDto),
        };
    }
    async verifyPayment(verifyDto) {
        return this.paymentsService.verifyPayment(verifyDto);
    }
    async simulatePayment(req, simulateDto) {
        return {
            success: true,
            data: await this.paymentsService.simulatePayment(String(req.user._id), simulateDto),
        };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Post)('create-order'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER),
    (0, swagger_1.ApiOperation)({ summary: 'Create Razorpay Order for a booking' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('verify'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER),
    (0, swagger_1.ApiOperation)({ summary: 'Verify Razorpay Payment Signature' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payment_dto_1.VerifyPaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('simulate'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.BORROWER),
    (0, swagger_1.ApiOperation)({ summary: 'Simulate Payment for a booking' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, payment_dto_1.SimulatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "simulatePayment", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map