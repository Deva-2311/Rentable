import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';
import { BookingsService } from '../bookings/bookings.service';

describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockReviewModel = {
    find: jest.fn(),
    create: jest.fn(),
  };

  const mockBookingsService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken(Review.name),
          useValue: mockReviewModel,
        },
        {
          provide: BookingsService,
          useValue: mockBookingsService,
        },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
