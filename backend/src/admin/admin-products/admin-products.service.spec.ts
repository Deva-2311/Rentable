import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AdminProductsService } from './admin-products.service';
import { Product } from '../../products/schemas/product.schema';
import { AuditLog } from '../../audit/schemas/audit-log.schema';

describe('AdminProductsService', () => {
  let service: AdminProductsService;

  const mockProductModel = {
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const mockAuditLogModel = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminProductsService,
        {
          provide: getModelToken(Product.name),
          useValue: mockProductModel,
        },
        {
          provide: getModelToken(AuditLog.name),
          useValue: mockAuditLogModel,
        },
      ],
    }).compile();

    service = module.get<AdminProductsService>(AdminProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
