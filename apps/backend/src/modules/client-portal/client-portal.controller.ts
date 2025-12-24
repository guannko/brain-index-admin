import { Controller, Get, Post, Body, Headers, HttpException, HttpStatus, Logger, Query } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';

interface PlanDetails {
  name: string;
  price: number;
  features: string[];
}

@Controller('portal')
export class ClientPortalController {
  private readonly logger = new Logger(ClientPortalController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly heartbeatService: HeartbeatService,
  ) {}

  private validateClient(clientId: string) {
    if (!clientId) {
      throw new HttpException('Client ID header missing', HttpStatus.UNAUTHORIZED);
    }
  }

  @Get('dashboard')
  async getDashboard(@Headers('x-client-id') clientId: string) {
    this.logger.log(`Dashboard request for client: ${clientId}`);
    this.validateClient(clientId);

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
    this.validateClient(clientId);

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
          // Mock stats until MongoDB integration
          stats: {
            messagesToday: Math.floor(Math.random() * 100),
            uptime: 99.9,
            lastActivity: '2 min ago',
          }
        };
      })
    );

    return botsWithStatus;
  }

  @Get('analytics')
  async getAnalytics(
    @Headers('x-client-id') clientId: string,
    @Query('period') period: string = 'week'
  ) {
    this.validateClient(clientId);

    // Mock data for analytics (TODO: MongoDB integration)
    const messagesOverTime = [
      { name: 'Mon', value: 120 },
      { name: 'Tue', value: 132 },
      { name: 'Wed', value: 101 },
      { name: 'Thu', value: 134 },
      { name: 'Fri', value: 290 },
      { name: 'Sat', value: 230 },
      { name: 'Sun', value: 210 },
    ];

    const messagesByBot = [
      { name: 'Fitness Coach', value: 450 },
      { name: 'BTC Analyzer', value: 320 },
      { name: 'Support Bot', value: 150 },
    ];

    return {
      period,
      stats: {
        totalMessages: 1234,
        activeUsers: 450,
        avgResponseTime: '1.2s',
        successRate: '99.8%',
      },
      messagesOverTime,
      messagesByBot,
      topCommands: [
        { command: '/start', count: 450 },
        { command: '/analyze', count: 210 },
        { command: '/help', count: 80 },
        { command: '/settings', count: 45 },
      ],
      peakHours: [
        { hour: '09:00', value: 45 },
        { hour: '12:00', value: 89 },
        { hour: '15:00', value: 67 },
        { hour: '18:00', value: 120 },
        { hour: '21:00', value: 95 },
      ],
    };
  }

  @Get('billing')
  async getBilling(@Headers('x-client-id') clientId: string) {
    this.validateClient(clientId);

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
      include: { invoices: { orderBy: { createdAt: 'desc' }, take: 10 } },
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    // Plan details
    const plans: Record<string, PlanDetails> = {
      starter: {
        name: 'Starter Plan',
        price: 99,
        features: ['1 Active Bot', '5,000 messages/month', 'Email Support', 'Basic Analytics'],
      },
      business: {
        name: 'Business Plan',
        price: 150,
        features: ['2 Active Bots', '10,000 messages/month', 'Priority Support', 'Full Analytics', 'Team Training'],
      },
      enterprise: {
        name: 'Enterprise Plan',
        price: 299,
        features: ['Unlimited Bots', 'Unlimited Messages', 'Dedicated Manager', 'Custom Development', 'SLA Guarantee'],
      },
    };

    const currentPlan = plans[client.plan] || plans.starter;

    return {
      plan: {
        ...currentPlan,
        currency: 'EUR',
      },
      nextBilling: client.nextBillingDate?.toISOString().split('T')[0] || '2025-01-15',
      invoices: client.invoices.length > 0 
        ? client.invoices.map(inv => ({
            id: inv.number,
            date: inv.createdAt.toISOString().split('T')[0],
            amount: Number(inv.amount),
            status: inv.status,
          }))
        : [
            // Mock data if no real invoices
            { id: 'INV-001', date: '2024-12-15', amount: 150, status: 'PAID' },
            { id: 'INV-002', date: '2024-11-15', amount: 150, status: 'PAID' },
          ],
    };
  }

  @Get('tickets')
  async getTickets(@Headers('x-client-id') clientId: string) {
    this.validateClient(clientId);

    const tickets = await this.prisma.ticket.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    // Return mock if empty
    if (tickets.length === 0) {
      return [
        {
          id: 'mock-1',
          subject: 'Bot not responding',
          status: 'IN_PROGRESS',
          priority: 'HIGH',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'mock-2',
          subject: 'Need help with integration',
          status: 'RESOLVED',
          priority: 'NORMAL',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
    }

    return tickets;
  }

  @Post('tickets')
  async createTicket(
    @Headers('x-client-id') clientId: string,
    @Body() body: { subject: string; description?: string; priority?: string }
  ) {
    this.validateClient(clientId);

    const ticket = await this.prisma.ticket.create({
      data: {
        subject: body.subject,
        description: body.description,
        priority: (body.priority as any) || 'NORMAL',
        clientId,
      },
    });

    return ticket;
  }

  @Get('settings')
  async getSettings(@Headers('x-client-id') clientId: string) {
    this.validateClient(clientId);

    const client = await this.prisma.client.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new HttpException('Client not found', HttpStatus.NOT_FOUND);
    }

    return {
      profile: {
        name: client.name,
        email: client.email,
        company: client.company,
        phone: client.phone,
      },
      notifications: {
        emailAlerts: true,
        telegramAlerts: false,
        weeklyReport: true,
      },
    };
  }
}
