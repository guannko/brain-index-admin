import { Module } from '@nestjs/common';
import { ClientPortalController } from './client-portal.controller';
import { PrismaService } from '../../prisma.service';
import { HeartbeatModule } from '../heartbeat/heartbeat.module';

@Module({
  imports: [HeartbeatModule],
  controllers: [ClientPortalController],
  providers: [PrismaService],
})
export class ClientPortalModule {}
