import { Test, TestingModule } from '@nestjs/testing';
import { AdminFinanceController } from './admin-finance.controller';

describe('AdminFinanceController', () => {
  let controller: AdminFinanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminFinanceController],
    }).compile();

    controller = module.get<AdminFinanceController>(AdminFinanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
