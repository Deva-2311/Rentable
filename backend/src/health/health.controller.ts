import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({
    summary: 'API health check — includes DB connectivity and memory usage',
  })
  async check() {
    const dbState = [
      'disconnected',
      'connected',
      'connecting',
      'disconnecting',
    ];
    const dbStatus = dbState[this.connection.readyState] ?? 'unknown';

    const memUsage = process.memoryUsage();
    const toMB = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

    return {
      status: dbStatus === 'connected' ? 'ok' : 'degraded',
      service: 'rentable-api',
      version: process.env.npm_package_version ?? '1.0.0',
      environment: process.env.NODE_ENV ?? 'development',
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      checks: {
        database: {
          status: dbStatus,
          healthy: dbStatus === 'connected',
        },
        memory: {
          heapUsed: toMB(memUsage.heapUsed),
          heapTotal: toMB(memUsage.heapTotal),
          rss: toMB(memUsage.rss),
          external: toMB(memUsage.external),
        },
      },
    };
  }
}
