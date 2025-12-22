import { PrismaClient, BotPlatform, ClientStatus, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding Brain Index...');

  // 1. Очистка базы (чтобы не дублировать при перезапуске)
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
  console.log('\n✅ Seeding finished!');
  console.log('📊 Summary: 3 clients, 4 projects, 4 bots');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
