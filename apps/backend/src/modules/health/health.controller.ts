import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  /**
   * GET /api/v1/health
   * Simple health check endpoint
   */
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'brain-index-api',
      version: '0.1.0',
    };
  }
}
