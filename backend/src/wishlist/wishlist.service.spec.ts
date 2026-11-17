import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WishlistService } from './wishlist.service';
import { Wishlist } from './schemas/wishlist.schema';

describe('WishlistService', () => {
  let service: WishlistService;

  const mockWishlistModel = {
    findOne: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WishlistService,
        {
          provide: getModelToken(Wishlist.name),
          useValue: mockWishlistModel,
        },
      ],
    }).compile();

    service = module.get<WishlistService>(WishlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
