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
exports.RentalsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const rental_schema_1 = require("./schemas/rental.schema");
let RentalsService = class RentalsService {
    rentalModel;
    constructor(rentalModel) {
        this.rentalModel = rentalModel;
    }
    async getActiveRentals(userId, isOwner) {
        const filter = isOwner ? { owner: userId } : { borrower: userId };
        return this.rentalModel.find({ ...filter, status: rental_schema_1.RentalStatus.ACTIVE }).populate('product').exec();
    }
    async getHistory(userId, isOwner) {
        const filter = isOwner ? { owner: userId } : { borrower: userId };
        return this.rentalModel.find({ ...filter, status: { $in: [rental_schema_1.RentalStatus.RETURNED, rental_schema_1.RentalStatus.COMPLETED] } }).populate('product').exec();
    }
    async findById(id) {
        const rental = await this.rentalModel.findById(id).populate('product booking borrower owner').exec();
        if (!rental) {
            throw new common_1.NotFoundException('Rental not found');
        }
        return rental;
    }
    async requestReturn(id, borrowerId) {
        const rental = await this.findById(id);
        if (String(rental.borrower._id || rental.borrower) !== String(borrowerId)) {
            throw new common_1.UnauthorizedException('You do not own this rental');
        }
        if (rental.status !== rental_schema_1.RentalStatus.ACTIVE) {
            throw new common_1.BadRequestException('Rental is not currently active');
        }
        rental.status = rental_schema_1.RentalStatus.RETURN_REQUESTED;
        rental.returnRequestedAt = new Date();
        return rental.save();
    }
    async completeRental(id, ownerId) {
        const rental = await this.findById(id);
        if (String(rental.owner._id || rental.owner) !== String(ownerId)) {
            throw new common_1.UnauthorizedException('You do not own the product for this rental');
        }
        if (rental.status !== rental_schema_1.RentalStatus.RETURN_REQUESTED && rental.status !== rental_schema_1.RentalStatus.RETURNED) {
            throw new common_1.BadRequestException('Borrower has not requested a return yet');
        }
        rental.status = rental_schema_1.RentalStatus.COMPLETED;
        rental.completedAt = new Date();
        return rental.save();
    }
};
exports.RentalsService = RentalsService;
exports.RentalsService = RentalsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(rental_schema_1.Rental.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], RentalsService);
//# sourceMappingURL=rentals.service.js.map