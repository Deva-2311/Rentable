import { Module } from '@nestjs/common';
import { AdminTrustController } from './admin-trust.controller';
import { AdminTrustService } from './admin-trust.service';

@Module({
  controllers: [AdminTrustController],
  providers: [AdminTrustService],
})
export class AdminTrustModule {}
