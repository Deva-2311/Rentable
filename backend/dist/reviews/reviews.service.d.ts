import { Model } from 'mongoose';
import { ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { BookingsService } from '../bookings/bookings.service';
export declare class ReviewsService {
    private reviewModel;
    private bookingsService;
    constructor(reviewModel: Model<ReviewDocument>, bookingsService: BookingsService);
    create(reviewerId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument>;
    findByProduct(productId: string): Promise<ReviewDocument[]>;
}
