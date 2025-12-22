import { Controller, Get, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';

@Controller('portal')
export class ClientPortalController {
  private readonly logger = new Logger(ClientPortalController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly heartbeatService: HeartbeatService,
  ) {}

  @Get('dashboard')
  async getDashboard(@Headers('x-client-id') clientId: string) {
    this.logger.log(`Dashboard request for client: ${clientId}`);

    if (!clientId) {
      throw new HttpException('Client ID header missing', HttpStatus.UNAUTHORIZED);
    }

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: {
        projects: true,
        bots: true,
      },
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    // Check LIVE status from Redis heartbeat for each bot
    const botsWithLiveStatus = await Promise.all(
      client.bots.map(async (bot) => {
        const heartbeat = await this.heartbeatService.getStatus(bot.id);
        return {
          id: bot.id,
          name: bot.name,
          username: bot.username,
          platform: bot.platform,
          isOnline: heartbeat?.status === 'online',
          lastPing: heartbeat?.lastPing || null,
          config: bot.config,
        };
      })
    );

    const onlineBots = botsWithLiveStatus.filter(b => b.isOnline).length;
    const totalMessages = 1234; // TODO: connect MongoDB for real stats

    return {
      clientName: client.name,
      clientEmail: client.email,
      company: client.company,
      stats: {
        activeBots: client.bots.length,
        onlineBots,
        automations: client.projects.length,
        totalMessages,
        supportUntil: 'Jan 15',
      },
      bots: botsWithLiveStatus,
      projects: client.projects.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        description: p.description,
      })),
    };
  }

  @Get('bots')
  async getMyBots(@Headers('x-client-id') clientId: string) {
    if (!clientId) {
      throw new HttpException('Client ID header missing', HttpStatus.UNAUTHORIZED);
    }

    const bots = await this.prisma.bot.findMany({
      where: { clientId },
    });

    // Add live status from Redis
    const botsWithStatus = await Promise.all(
      bots.map(async (bot) => {
        const heartbeat = await this.heartbeatService.getStatus(bot.id);
        return {
          ...bot,
          isOnline: heartbeat?.status === 'online',
          lastPing: heartbeat?.lastPing || null,
        };
      })
    );

    return botsWithStatus;
  }
}
