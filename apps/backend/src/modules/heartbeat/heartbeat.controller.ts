import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  Logger,
} from '@nestjs/common';
import { HeartbeatService } from './heartbeat.service';
import { HeartbeatPayload } from '@brain-index/types';

@Controller('heartbeat')
export class HeartbeatController {
  private readonly logger = new Logger(HeartbeatController.name);

  constructor(private readonly heartbeatService: HeartbeatService) {}

  /**
   * POST /api/v1/heartbeat
   * Bots call this endpoint every 60 seconds
   */
  @Post()
  async ping(
    @Headers('x-bot-token') token: string,
    @Body() payload: HeartbeatPayload,
  ) {
    // TODO: Validate token against database (Phase 2)
    // For now, just process the heartbeat
    this.logger.log(`📡 Received heartbeat from bot: ${payload.botId}`);
    return this.heartbeatService.processHeartbeat(payload);
  }

  /**
   * GET /api/v1/heartbeat/:id
   * Check status of a specific bot
   */
  @Get(':id')
  async getStatus(@Param('id') id: string) {
    return this.heartbeatService.getBotStatus(id);
  }

  /**
   * GET /api/v1/heartbeat
   * Get all bot statuses (for admin dashboard)
   */
  @Get()
  async getAllStatuses() {
    return this.heartbeatService.getAllBotStatuses();
  }
}
