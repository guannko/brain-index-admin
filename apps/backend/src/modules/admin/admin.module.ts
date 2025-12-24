import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../prisma.service';
import { HeartbeatService } from '../heartbeat/heartbeat.service';

@Module({
  controllers: [AdminController],
  providers: [PrismaService, HeartbeatService],
})
export class AdminModule {}
