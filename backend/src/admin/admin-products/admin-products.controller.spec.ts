import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductsController } from './admin-products.controller';
import { AdminProductsService } from './admin-products.service';

describe('AdminProductsController', () => {
  let controller: AdminProductsController;

  const mockProductsService = {
    getPendingProducts: jest.fn(),
    approveProduct: jest.fn(),
    rejectProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProductsController],
      providers: [
        {
          provide: AdminProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<AdminProductsController>(AdminProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
