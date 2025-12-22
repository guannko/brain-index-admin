import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { HeartbeatPayload, HeartbeatStatus } from '@brain-index/types';

@Injectable()
export class HeartbeatService {
  private readonly logger = new Logger(HeartbeatService.name);
  private readonly redis: Redis;
  private readonly HEARTBEAT_TTL = 90; // seconds

  constructor(private readonly redisService: RedisService) {
    this.redis = this.redisService.getOrThrow();
  }

  /**
   * Process heartbeat from a bot
   * Bot sends ping -> we store in Redis with TTL
   * If bot dies, key expires automatically
   */
  async processHeartbeat(payload: HeartbeatPayload): Promise<{ status: string }> {
    const key = `bot:heartbeat:${payload.botId}`;

    const data = {
      status: 'online',
      lastPing: new Date().toISOString(),
      uptime: payload.uptime,
      memoryUsage: payload.memoryUsage,
      customMeta: payload.customMeta,
    };

    // Store with TTL - key auto-expires if bot stops pinging
    await this.redis.set(key, JSON.stringify(data), 'EX', this.HEARTBEAT_TTL);

    this.logger.debug(`💓 Heartbeat from ${payload.botId}`);
    return { status: 'acknowledged' };
  }

  /**
   * Get bot status from Redis
   * If key exists -> online, if not -> offline
   */
  async getBotStatus(botId: string): Promise<HeartbeatStatus> {
    const key = `bot:heartbeat:${botId}`;
    const data = await this.redis.get(key);

    if (!data) {
      return { status: 'offline', lastPing: null };
    }

    const parsed = JSON.parse(data);
    return {
      status: 'online',
      lastPing: parsed.lastPing,
      meta: {
        uptime: parsed.uptime,
        memoryUsage: parsed.memoryUsage,
        ...parsed.customMeta,
      },
    };
  }

  // Alias for getBotStatus
  async getStatus(botId: string): Promise<HeartbeatStatus> {
    return this.getBotStatus(botId);
  }

  /**
   * Get all bot statuses (for dashboard)
   */
  async getAllBotStatuses(): Promise<Record<string, HeartbeatStatus>> {
    const keys = await this.redis.keys('bot:heartbeat:*');
    const result: Record<string, HeartbeatStatus> = {};

    for (const key of keys) {
      const botId = key.replace('bot:heartbeat:', '');
      result[botId] = await this.getBotStatus(botId);
    }

    return result;
  }
}
