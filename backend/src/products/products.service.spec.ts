import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { Product } from './schemas/product.schema';
import { Category } from '../categories/schemas/category.schema';

describe('ProductsService', () => {
  let service: ProductsService;

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockCategoryModel = {
    findById: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(Category.name),
          useValue: mockCategoryModel,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
