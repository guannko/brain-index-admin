import { Controller, Get, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly heartbeatService: HeartbeatService,
  ) {}

  // All bots with owner details
  @Get('bots')
  async getAllBots() {
    const bots = await this.prisma.bot.findMany({
      include: {
        client: {
          select: { name: true, company: true, email: true }
        }
      }
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

  // All automations
  @Get('automations')
  async getAllAutomations() {
    return this.prisma.automation.findMany({
      include: {
        client: {
          select: { name: true, company: true }
        }
      },
      orderBy: { lastRun: 'desc' }
    });
  }

  // Infrastructure health (Mock for MVP)
  @Get('health')
  async getInfrastructureHealth() {
    // Get real counts from DB
    const [clientCount, botCount, automationCount] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.bot.count(),
      this.prisma.automation.count(),
    ]);

    // Get all heartbeat statuses
    const allHeartbeats = await this.heartbeatService.getAllStatuses();
    const onlineBots = Object.values(allHeartbeats).filter((h: any) => h?.status === 'online').length;

    return [
      { 
        service: 'PostgreSQL', 
        status: 'healthy', 
        metrics: { 
          cpu: '12%', 
          clients: clientCount.toString(),
          bots: botCount.toString(),
          uptime: '14d' 
        } 
      },
      { 
        service: 'MongoDB', 
        status: 'healthy', 
        metrics: { cpu: '8%', docs: '12.5k', size: '450MB' } 
      },
      { 
        service: 'Redis', 
        status: 'healthy', 
        metrics: { 
          memory: '45MB', 
          onlineBots: onlineBots.toString(),
          hitRate: '99%' 
        } 
      },
      { 
        service: 'n8n Workflow Engine', 
        status: automationCount > 0 ? 'healthy' : 'warning', 
        metrics: { 
          active: automationCount, 
          queue: 2, 
          errors: 0 
        } 
      },
      { 
        service: 'Make.com Gateway', 
        status: 'healthy', 
        metrics: { 
          scenarios: '16',
          runsToday: '89',
          successRate: '99.2%' 
        } 
      }
    ];
  }

  // Alerts (Mock for MVP)
  @Get('alerts')
  async getAlerts() {
    // In future: real alerts from monitoring system
    return [
      {
        id: '1',
        type: 'warning',
        title: 'High API Response Time',
        message: 'Average response time exceeded 500ms threshold',
        service: 'Backend API',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        acknowledged: false,
      },
      {
        id: '2',
        type: 'info',
        title: 'New Client Registered',
        message: 'John Doe (Tech Startup Inc) signed up',
        service: 'Client Portal',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        acknowledged: true,
      },
      {
        id: '3',
        type: 'success',
        title: 'Backup Completed',
        message: 'Daily PostgreSQL backup finished successfully',
        service: 'Database',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        acknowledged: true,
      },
      {
        id: '4',
        type: 'error',
        title: 'Bot Offline',
        message: 'BTC Alpha Signal bot went offline unexpectedly',
        service: 'Bot Manager',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        acknowledged: false,
      },
    ];
  }
}
