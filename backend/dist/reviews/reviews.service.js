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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const review_schema_1 = require("./schemas/review.schema");
const bookings_service_1 = require("../bookings/bookings.service");
const booking_schema_1 = require("../bookings/schemas/booking.schema");
let ReviewsService = class ReviewsService {
    reviewModel;
    bookingsService;
    constructor(reviewModel, bookingsService) {
        this.reviewModel = reviewModel;
        this.bookingsService = bookingsService;
    }
    async create(reviewerId, createReviewDto) {
        const booking = await this.bookingsService.findById(createReviewDto.booking);
        if (booking.borrower._id.toString() !== reviewerId) {
            throw new common_1.BadRequestException('You did not borrow this product');
        }
        if (booking.status !== booking_schema_1.BookingStatus.COMPLETED && booking.status !== booking_schema_1.BookingStatus.RETURNED) {
            throw new common_1.BadRequestException('You can only review a product after completing the rental');
        }
        const existingReview = await this.reviewModel.findOne({ booking: createReviewDto.booking });
        if (existingReview) {
            throw new common_1.BadRequestException('You have already reviewed this booking');
        }
        const createdReview = await new this.reviewModel({
            ...createReviewDto,
            reviewer: reviewerId,
        }).save();
        const allReviews = await this.reviewModel.find({ product: createReviewDto.product });
        const totalRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
        const avgRating = totalRating / allReviews.length;
        await this.bookingsService.productsService.productModel.findByIdAndUpdate(createReviewDto.product, { rating: avgRating, reviewCount: allReviews.length });
        return createdReview;
    }
    async findByProduct(productId) {
        return this.reviewModel.find({ product: productId }).populate('reviewer', 'fullName avatar').exec();
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        bookings_service_1.BookingsService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map