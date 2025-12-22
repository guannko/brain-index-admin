import { Controller, Get, Headers, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Controller('portal')
export class ClientPortalController {
  private readonly logger = new Logger(ClientPortalController.name);

  constructor(private readonly prisma: PrismaService) {}

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

    // Считаем онлайн ботов (из isOnline поля)
    const onlineBots = client.bots.filter(b => b.isOnline).length;
    const totalMessages = 1234; // TODO: подключить MongoDB для реальной статистики

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
      bots: client.bots.map(bot => ({
        id: bot.id,
        name: bot.name,
        username: bot.username,
        platform: bot.platform,
        isOnline: bot.isOnline,
        config: bot.config,
      })),
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

    return bots;
  }
}
