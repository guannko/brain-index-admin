import { PrismaClient, BotPlatform, ClientStatus, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Brain Index...');

  // 1. Очистка базы (чтобы не дублировать при перезапуске)
  await prisma.automation.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.bot.deleteMany();
  await prisma.project.deleteMany();
  await prisma.client.deleteMany();
  
  console.log('🧹 Cleared existing data');

  // 2. Создаем Клиентов с проектами
  const client1 = await prisma.client.create({
    data: {
      name: 'John Doe',
      email: 'john@startup.io',
      company: 'Tech Startup Inc',
      phone: '+1-555-0101',
      status: ClientStatus.ACTIVE,
      plan: 'starter',
      planPrice: 99,
      nextBillingDate: new Date('2025-01-15'),
      projects: {
        create: [
          {
            name: 'AI Support Bot',
            description: 'Customer support automation with GPT-4',
            status: ProjectStatus.DEVELOPMENT,
            price: 1500,
          }
        ]
      }
    },
  });
  console.log(`✅ Created client: ${client1.name}`);

  const client2 = await prisma.client.create({
    data: {
      name: 'Alice Smith',
      email: 'alice@crypto-fund.com',
      company: 'Moon Capital',
      phone: '+1-555-0202',
      status: ClientStatus.ACTIVE,
      plan: 'business',
      planPrice: 150,
      nextBillingDate: new Date('2025-01-20'),
      projects: {
        create: [
          {
            name: 'Crypto Analyzer v2',
            description: 'Real-time crypto signals and analysis',
            status: ProjectStatus.SUPPORT,
            price: 3000,
          }
        ]
      }
    },
  });
  console.log(`✅ Created client: ${client2.name}`);

  const client3 = await prisma.client.create({
    data: {
      name: 'Boris Yustov',
      email: 'boris@brain-index.com',
      company: 'Brain Index',
      phone: '+357-99-123456',
      status: ClientStatus.ACTIVE,
      plan: 'enterprise',
      planPrice: 299,
      nextBillingDate: new Date('2025-01-25'),
      projects: {
        create: [
          {
            name: 'Fitness Coach Bot',
            description: 'AI fitness coaching with meal tracking',
            status: ProjectStatus.DELIVERED,
            price: 2500,
          },
          {
            name: 'BTC Predictor v4.1',
            description: 'Dual-engine BTC analysis system',
            status: ProjectStatus.SUPPORT,
            price: 5000,
          }
        ]
      }
    },
  });
  console.log(`✅ Created client: ${client3.name}`);

  // 3. Создаем Ботов
  await prisma.bot.create({
    data: {
      name: 'Support Assistant',
      platform: BotPlatform.TELEGRAM,
      username: '@tech_support_bot',
      isOnline: true,
      clientId: client1.id,
      config: { model: 'gpt-4-turbo', temperature: 0.7 },
    },
  });

  await prisma.bot.create({
    data: {
      name: 'BTC Alpha Signal',
      platform: BotPlatform.TELEGRAM,
      username: '@alpha_sig_bot',
      isOnline: false,
      clientId: client2.id,
      config: { model: 'deepseek-chat' },
    },
  });

  await prisma.bot.create({
    data: {
      name: 'Fitness Coach AI',
      platform: BotPlatform.TELEGRAM,
      username: '@fitness_coach_ai_bot',
      isOnline: true,
      clientId: client3.id,
      config: { model: 'llama-4-scout', visionEnabled: true },
    },
  });

  await prisma.bot.create({
    data: {
      name: 'BTC Analyzer v4.1',
      platform: BotPlatform.TELEGRAM,
      username: '@alexyust_bot',
      isOnline: true,
      clientId: client3.id,
      config: { dualEngine: true, longInterval: '1h', fastInterval: '5m' },
    },
  });

  console.log('🤖 Created 4 bots');

  // 4. Создаем Тикеты
  await prisma.ticket.create({
    data: {
      subject: 'Bot not responding to /start',
      description: 'Users report that the bot does not respond to the start command',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      clientId: client1.id,
    },
  });

  await prisma.ticket.create({
    data: {
      subject: 'Need help with webhook setup',
      description: 'How do I configure webhooks for real-time updates?',
      status: 'OPEN',
      priority: 'NORMAL',
      clientId: client2.id,
    },
  });

  await prisma.ticket.create({
    data: {
      subject: 'Request: Add calorie tracking feature',
      description: 'Would like to add automatic calorie counting from photos',
      status: 'RESOLVED',
      priority: 'NORMAL',
      clientId: client3.id,
    },
  });

  console.log('🎫 Created 3 tickets');

  // 5. Создаем Инвойсы
  await prisma.invoice.create({
    data: {
      number: 'INV-2024-001',
      amount: 99,
      currency: 'EUR',
      status: 'PAID',
      description: 'Starter Plan - December 2024',
      dueDate: new Date('2024-12-15'),
      paidAt: new Date('2024-12-14'),
      clientId: client1.id,
    },
  });

  await prisma.invoice.create({
    data: {
      number: 'INV-2024-002',
      amount: 150,
      currency: 'EUR',
      status: 'PAID',
      description: 'Business Plan - December 2024',
      dueDate: new Date('2024-12-20'),
      paidAt: new Date('2024-12-19'),
      clientId: client2.id,
    },
  });

  await prisma.invoice.create({
    data: {
      number: 'INV-2024-003',
      amount: 299,
      currency: 'EUR',
      status: 'PAID',
      description: 'Enterprise Plan - December 2024',
      dueDate: new Date('2024-12-25'),
      paidAt: new Date('2024-12-24'),
      clientId: client3.id,
    },
  });

  await prisma.invoice.create({
    data: {
      number: 'INV-2024-004',
      amount: 299,
      currency: 'EUR',
      status: 'PENDING',
      description: 'Enterprise Plan - January 2025',
      dueDate: new Date('2025-01-25'),
      clientId: client3.id,
    },
  });

  console.log('💰 Created 4 invoices');

  // 6. Создаем Автоматизации
  await prisma.automation.create({
    data: {
      name: 'Make.com Gateway',
      platform: 'n8n',
      externalId: 'WsVlI8ld32XAk5JV',
      status: 'ACTIVE',
      lastRun: new Date(),
      runsToday: 127,
      successRate: 98.5,
    },
  });

  await prisma.automation.create({
    data: {
      name: 'Fitness Bot Webhook Handler',
      platform: 'n8n',
      externalId: 'fitness-webhook-123',
      status: 'ACTIVE',
      lastRun: new Date(Date.now() - 300000),
      runsToday: 45,
      successRate: 100,
      clientId: client3.id,
    },
  });

  await prisma.automation.create({
    data: {
      name: 'BTC Signal Processor',
      platform: 'make',
      externalId: '7850736',
      status: 'ACTIVE',
      lastRun: new Date(Date.now() - 600000),
      runsToday: 89,
      successRate: 99.2,
      clientId: client3.id,
    },
  });

  await prisma.automation.create({
    data: {
      name: 'Client Onboarding Flow',
      platform: 'make',
      externalId: '7908237',
      status: 'PAUSED',
      lastRun: new Date(Date.now() - 86400000),
      runsToday: 0,
      successRate: 95.0,
    },
  });

  console.log('⚡ Created 4 automations');

  console.log('\n✅ Seeding finished!');
  console.log('📊 Summary: 3 clients, 4 projects, 4 bots, 3 tickets, 4 invoices, 4 automations');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
