import { Test, TestingModule } from '@nestjs/testing';
import { AdminFinanceService } from './admin-finance.service';

describe('AdminFinanceService', () => {
  let service: AdminFinanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminFinanceService],
    }).compile();

    service = module.get<AdminFinanceService>(AdminFinanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
