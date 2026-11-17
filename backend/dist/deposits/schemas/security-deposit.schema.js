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
exports.SecurityDepositSchema = exports.SecurityDeposit = exports.DepositStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var DepositStatus;
(function (DepositStatus) {
    DepositStatus["HELD"] = "HELD";
    DepositStatus["RELEASE_PENDING"] = "RELEASE_PENDING";
    DepositStatus["RELEASED"] = "RELEASED";
    DepositStatus["PARTIALLY_DEDUCTED"] = "PARTIALLY_DEDUCTED";
    DepositStatus["FULLY_DEDUCTED"] = "FULLY_DEDUCTED";
    DepositStatus["DISPUTED"] = "DISPUTED";
})(DepositStatus || (exports.DepositStatus = DepositStatus = {}));
let SecurityDeposit = class SecurityDeposit {
    booking;
    borrower;
    owner;
    amount;
    status;
    originalPaymentId;
    deductions;
    totalDeducted;
    releasedAt;
    gatewayRefundId;
};
exports.SecurityDeposit = SecurityDeposit;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityDeposit.prototype, "booking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityDeposit.prototype, "borrower", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityDeposit.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], SecurityDeposit.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(DepositStatus),
        default: DepositStatus.HELD,
    }),
    __metadata("design:type", String)
], SecurityDeposit.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Payment' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], SecurityDeposit.prototype, "originalPaymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Object], default: [] }),
    __metadata("design:type", Array)
], SecurityDeposit.prototype, "deductions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], SecurityDeposit.prototype, "totalDeducted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], SecurityDeposit.prototype, "releasedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SecurityDeposit.prototype, "gatewayRefundId", void 0);
exports.SecurityDeposit = SecurityDeposit = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SecurityDeposit);
exports.SecurityDepositSchema = mongoose_1.SchemaFactory.createForClass(SecurityDeposit);
//# sourceMappingURL=security-deposit.schema.js.map