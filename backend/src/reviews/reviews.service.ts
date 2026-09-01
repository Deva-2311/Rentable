import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingsService } from '../bookings/bookings.service';
import { BookingStatus } from '../bookings/schemas/booking.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private bookingsService: BookingsService,
  ) {}

  async create(reviewerId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    const booking = await this.bookingsService.findById(createReviewDto.booking);
    
    // Validate that the user actually borrowed this product
    if ((booking.borrower as any)._id.toString() !== reviewerId) {
      throw new BadRequestException('You did not borrow this product');
    }

    // Validate that the booking is completed or returned
    if (booking.status !== BookingStatus.COMPLETED && booking.status !== BookingStatus.RETURNED) {
      throw new BadRequestException('You can only review a product after completing the rental');
    }

    // Check for duplicate reviews (Enforced by Schema unique index on booking)
    const existingReview = await this.reviewModel.findOne({ booking: createReviewDto.booking });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this booking');
    }

    const createdReview = await new this.reviewModel({
      ...createReviewDto,
      reviewer: reviewerId,
    }).save();
    
    // Update Product average rating
    const allReviews = await this.reviewModel.find({ product: createReviewDto.product });
    const totalRating = allReviews.reduce((acc, rev) => acc + rev.rating, 0);
    const avgRating = totalRating / allReviews.length;
    
    await ((this.bookingsService as any).productsService as any).productModel.findByIdAndUpdate(
      createReviewDto.product,
      { rating: avgRating, reviewCount: allReviews.length }
    );

    return createdReview;
  }

  async findByProduct(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ product: productId }).populate('reviewer', 'fullName avatar').exec();
  }
}
