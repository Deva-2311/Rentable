import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Check API Health' })
  check() {
    return {
      status: 'ok',
      service: 'rentable-api',
      timestamp: new Date().toISOString(),
    };
  }
}
