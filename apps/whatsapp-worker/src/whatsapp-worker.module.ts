import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WhatsappWorkerService } from './whatsapp-worker.service';
import { RabbitmqModule } from 'libs/rabbitmq/src';
import { PrismaModule } from 'libs/prisma/src';

@Module({
  imports: [ConfigModule.forRoot(), RabbitmqModule, PrismaModule],
  providers: [WhatsappWorkerService],
})
export class WhatsappWorkerModule {}
