import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';

import { PrismaService } from './prisma.service';
import { HeartbeatModule } from './modules/heartbeat/heartbeat.module';
import { HealthModule } from './modules/health/health.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ClientPortalModule } from './modules/client-portal/client-portal.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB (Logs)
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get(
          'MONGO_URI',
          'mongodb://admin:admin_password@localhost:27017/brain_index_logs?authSource=admin',
        ),
      }),
    }),

    // Redis (Cache & Heartbeat)
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        readyLog: true,
        config: {
          host: config.get('REDIS_HOST', 'localhost'),
          port: config.get('REDIS_PORT', 6379),
          password: config.get('REDIS_PASSWORD', 'admin_password'),
        },
      }),
    }),

    // Feature Modules
    HeartbeatModule,
    HealthModule,
    ClientsModule,
    ClientPortalModule,
    AdminModule,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
