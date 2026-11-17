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
exports.RentalSchema = exports.Rental = exports.RentalStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var RentalStatus;
(function (RentalStatus) {
    RentalStatus["UPCOMING"] = "UPCOMING";
    RentalStatus["ACTIVE"] = "ACTIVE";
    RentalStatus["RETURN_REQUESTED"] = "RETURN_REQUESTED";
    RentalStatus["RETURNED"] = "RETURNED";
    RentalStatus["COMPLETED"] = "COMPLETED";
})(RentalStatus || (exports.RentalStatus = RentalStatus = {}));
let Rental = class Rental {
    booking;
    product;
    borrower;
    owner;
    startDate;
    endDate;
    status;
    returnRequestedAt;
    returnedAt;
    completedAt;
};
exports.Rental = Rental;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Booking', required: true }),
    __metadata("design:type", String)
], Rental.prototype, "booking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", String)
], Rental.prototype, "product", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Rental.prototype, "borrower", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", String)
], Rental.prototype, "owner", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Rental.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Rental.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, enum: RentalStatus, default: RentalStatus.UPCOMING }),
    __metadata("design:type", String)
], Rental.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Rental.prototype, "returnRequestedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Rental.prototype, "returnedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Rental.prototype, "completedAt", void 0);
exports.Rental = Rental = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Rental);
exports.RentalSchema = mongoose_1.SchemaFactory.createForClass(Rental);
//# sourceMappingURL=rental.schema.js.map