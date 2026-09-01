import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(req: any, createReviewDto: CreateReviewDto): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").ReviewDocument;
    }>;
    findByProduct(productId: string): Promise<{
        success: boolean;
        data: import("./schemas/review.schema").ReviewDocument[];
    }>;
}
