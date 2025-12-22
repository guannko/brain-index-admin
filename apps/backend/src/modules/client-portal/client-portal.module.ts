import { Module } from '@nestjs/common';
import { ClientPortalController } from './client-portal.controller';
import { PrismaService } from '../../prisma.service';

@Module({
  controllers: [ClientPortalController],
  providers: [PrismaService],
})
export class ClientPortalModule {}
