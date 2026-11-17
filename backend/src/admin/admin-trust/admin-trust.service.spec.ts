import { Test, TestingModule } from '@nestjs/testing';
import { AdminTrustService } from './admin-trust.service';

describe('AdminTrustService', () => {
  let service: AdminTrustService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminTrustService],
    }).compile();

    service = module.get<AdminTrustService>(AdminTrustService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
