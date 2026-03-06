import { Module } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { MessageController } from '../controllers/message.controller';
import { PrismaModule } from 'libs/prisma/src';
import { RabbitmqModule } from 'libs/rabbitmq/src';
import { ScheduleService } from '../services/schedule.service';
import { MessagePollingService } from '../services/message-polling.service';

@Module({
  imports: [PrismaModule, RabbitmqModule],
  controllers: [MessageController],
  providers: [MessageService, ScheduleService, MessagePollingService],
  exports: [MessageService],
})
export class MessageModule {}
