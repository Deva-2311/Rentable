import { Test, TestingModule } from '@nestjs/testing';
import { AdminTrustController } from './admin-trust.controller';

describe('AdminTrustController', () => {
  let controller: AdminTrustController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminTrustController],
    }).compile();

    controller = module.get<AdminTrustController>(AdminTrustController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
