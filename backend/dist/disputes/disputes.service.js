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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const dispute_schema_1 = require("./schemas/dispute.schema");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
let DisputesService = class DisputesService {
    disputeModel;
    bookingModel;
    constructor(disputeModel, bookingModel) {
        this.disputeModel = disputeModel;
        this.bookingModel = bookingModel;
    }
    async create(userId, role, dto) {
        const bookingQuery = (0, mongoose_2.isValidObjectId)(dto.bookingId)
            ? { $or: [{ _id: new mongoose_2.Types.ObjectId(dto.bookingId) }, { bookingId: dto.bookingId }] }
            : { bookingId: dto.bookingId };
        const booking = await this.bookingModel.findOne(bookingQuery).exec();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID '${dto.bookingId}' not found`);
        }
        const borrowerStr = String(booking.borrower?._id || booking.borrower);
        const ownerStr = String(booking.owner?._id || booking.owner);
        const userStr = String(userId);
        const isParty = userStr === borrowerStr || userStr === ownerStr;
        const isAdmin = role === 'admin' || role === 'super_admin';
        if (!isParty && !isAdmin) {
            throw new common_1.ForbiddenException('You can only file disputes for your own bookings');
        }
        const openedById = new mongoose_2.Types.ObjectId(userStr);
        const targetUserId = userStr === borrowerStr
            ? new mongoose_2.Types.ObjectId(ownerStr)
            : new mongoose_2.Types.ObjectId(borrowerStr);
        const dispute = new this.disputeModel({
            booking: booking._id,
            openedBy: openedById,
            targetUser: targetUserId,
            product: booking.product,
            reason: dto.reason,
            description: dto.description,
            status: dispute_schema_1.DisputeStatus.OPENED,
            evidenceUrls: dto.evidenceUrls || [],
        });
        return dispute.save();
    }
    async findAll(userId, role) {
        const isAdmin = role === 'admin' || role === 'super_admin';
        const filter = isAdmin
            ? {}
            : {
                $or: [
                    { openedBy: new mongoose_2.Types.ObjectId(userId) },
                    { targetUser: new mongoose_2.Types.ObjectId(userId) },
                ],
            };
        return this.disputeModel
            .find(filter)
            .populate('product', 'name images pricePerDay')
            .populate('booking', 'bookingId startDate endDate rentalAmount')
            .populate('openedBy', 'fullName email role avatar')
            .populate('targetUser', 'fullName email role avatar')
            .sort({ createdAt: -1 })
            .exec();
    }
    async findOne(id, userId, role) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid dispute ID format');
        }
        const dispute = await this.disputeModel
            .findById(id)
            .populate('product', 'name images pricePerDay securityDeposit location')
            .populate('booking', 'bookingId startDate endDate rentalAmount duration')
            .populate('openedBy', 'fullName email role avatar')
            .populate('targetUser', 'fullName email role avatar')
            .exec();
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        const isAdmin = role === 'admin' || role === 'super_admin';
        const isParty = String(dispute.openedBy?._id || dispute.openedBy) === String(userId) ||
            String(dispute.targetUser?._id || dispute.targetUser) === String(userId);
        if (!isAdmin && !isParty) {
            throw new common_1.ForbiddenException('You do not have permission to view this dispute');
        }
        return dispute;
    }
    async resolve(id, adminId, dto) {
        if (!(0, mongoose_2.isValidObjectId)(id)) {
            throw new common_1.BadRequestException('Invalid dispute ID format');
        }
        const dispute = await this.disputeModel.findById(id).exec();
        if (!dispute) {
            throw new common_1.NotFoundException('Dispute not found');
        }
        dispute.status = dispute_schema_1.DisputeStatus.RESOLVED;
        dispute.assignedAdmin = new mongoose_2.Types.ObjectId(adminId);
        dispute.resolution = {
            action: dto.action,
            amount: dto.amount,
            reason: dto.reason,
            resolvedAt: new Date(),
            resolvedBy: new mongoose_2.Types.ObjectId(adminId),
        };
        return dispute.save();
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(dispute_schema_1.Dispute.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map