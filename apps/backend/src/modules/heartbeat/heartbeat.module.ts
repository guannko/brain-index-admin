import { Module } from '@nestjs/common';
import { HeartbeatController } from './heartbeat.controller';
import { HeartbeatService } from './heartbeat.service';

@Module({
  controllers: [HeartbeatController],
  providers: [HeartbeatService],
  exports: [HeartbeatService], // Export for use in other modules
})
export class HeartbeatModule {}
