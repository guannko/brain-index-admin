import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { HeartbeatModule } from './modules/heartbeat/heartbeat.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // PostgreSQL (Core Data)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('POSTGRES_HOST', 'localhost'),
        port: config.get('POSTGRES_PORT', 5432),
        username: config.get('POSTGRES_USER', 'admin'),
        password: config.get('POSTGRES_PASSWORD', 'admin_password'),
        database: config.get('POSTGRES_DB', 'brain_index_core'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production', // Disable in prod!
      }),
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
  ],
})
export class AppModule {}
