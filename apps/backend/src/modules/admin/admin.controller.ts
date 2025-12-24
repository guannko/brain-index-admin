import { Controller, Get, Post, Patch, Param, Body, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';
import { AlertType } from '@prisma/client';

@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly heartbeatService: HeartbeatService,
  ) {}

  // ==================== BOTS ====================

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

  // ==================== AUTOMATIONS ====================

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

  // ==================== INFRASTRUCTURE ====================

  @Get('health')
  async getInfrastructureHealth() {
    const [clientCount, botCount, automationCount] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.bot.count(),
      this.prisma.automation.count(),
    ]);

    const allHeartbeats = await this.heartbeatService.getAllBotStatuses();
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

  // ==================== ALERTS ====================

  @Get('alerts')
  async getAlerts() {
    // Seed demo alerts if empty
    const count = await this.prisma.alert.count();
    if (count === 0) {
      await this.prisma.alert.createMany({
        data: [
          { type: AlertType.CRITICAL, message: 'Bot "BTC Analyzer" connection lost', source: 'Heartbeat Service' },
          { type: AlertType.WARNING, message: 'High memory usage (85%) on Redis', source: 'Infrastructure' },
          { type: AlertType.INFO, message: 'New client registered: Acme Corp', source: 'Auth System' },
          { type: AlertType.WARNING, message: 'API response time exceeded 500ms threshold', source: 'Backend API' },
        ]
      });
    }

    return this.prisma.alert.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  @Patch('alerts/:id/read')
  async markAlertAsRead(@Param('id') id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { isRead: true }
    });
  }

  @Patch('alerts/:id/unread')
  async markAlertAsUnread(@Param('id') id: string) {
    return this.prisma.alert.update({
      where: { id },
      data: { isRead: false }
    });
  }

  // ==================== SETTINGS ====================

  @Get('settings')
  async getSettings() {
    // Get all settings from DB
    const settings = await this.prisma.systemSetting.findMany();
    
    // Convert to object
    const settingsMap: Record<string, any> = {};
    settings.forEach(s => {
      settingsMap[s.key] = s.value;
    });

    // Return with defaults
    return {
      profile: settingsMap['profile'] || { 
        email: 'admin@brain-index.com', 
        name: 'Super Admin' 
      },
      system: settingsMap['system'] || { 
        maintenanceMode: false, 
        debugLogs: true,
        backupFrequency: 'daily',
        logRetention: 30
      },
      notifications: settingsMap['notifications'] || { 
        telegram: true, 
        email: true,
        slack: false,
        alertThreshold: 'warning'
      },
      security: settingsMap['security'] || {
        twoFactorAuth: false,
        sessionTimeout: 24
      }
    };
  }

  @Post('settings')
  async updateSettings(@Body() body: Record<string, any>) {
    // Upsert each settings category
    const updates = Object.entries(body).map(([key, value]) => 
      this.prisma.systemSetting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any }
      })
    );

    await Promise.all(updates);
    
    return { status: 'updated', config: body };
  }
}
