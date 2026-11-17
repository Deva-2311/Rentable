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
exports.ReportSchema = exports.Report = exports.ReportPriority = exports.ReportTargetType = exports.ReportStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var ReportStatus;
(function (ReportStatus) {
    ReportStatus["OPEN"] = "OPEN";
    ReportStatus["INVESTIGATING"] = "INVESTIGATING";
    ReportStatus["RESOLVED"] = "RESOLVED";
    ReportStatus["DISMISSED"] = "DISMISSED";
})(ReportStatus || (exports.ReportStatus = ReportStatus = {}));
var ReportTargetType;
(function (ReportTargetType) {
    ReportTargetType["USER"] = "USER";
    ReportTargetType["PRODUCT"] = "PRODUCT";
    ReportTargetType["REVIEW"] = "REVIEW";
})(ReportTargetType || (exports.ReportTargetType = ReportTargetType = {}));
var ReportPriority;
(function (ReportPriority) {
    ReportPriority["LOW"] = "LOW";
    ReportPriority["MEDIUM"] = "MEDIUM";
    ReportPriority["HIGH"] = "HIGH";
    ReportPriority["CRITICAL"] = "CRITICAL";
})(ReportPriority || (exports.ReportPriority = ReportPriority = {}));
let Report = class Report {
    reporter;
    targetType;
    targetId;
    reason;
    description;
    priority;
    status;
    assignedAdmin;
};
exports.Report = Report;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "reporter", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, enum: Object.values(ReportTargetType) }),
    __metadata("design:type", String)
], Report.prototype, "targetType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "targetId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Report.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Report.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(ReportPriority),
        default: ReportPriority.LOW,
    }),
    __metadata("design:type", String)
], Report.prototype, "priority", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(ReportStatus),
        default: ReportStatus.OPEN,
    }),
    __metadata("design:type", String)
], Report.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Report.prototype, "assignedAdmin", void 0);
exports.Report = Report = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Report);
exports.ReportSchema = mongoose_1.SchemaFactory.createForClass(Report);
//# sourceMappingURL=report.schema.js.map