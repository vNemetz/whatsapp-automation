import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { PrismaService } from 'libs/prisma/src';
import { RabbitMqService } from 'libs/rabbitmq/src';

@Injectable()
export class MessagePollingService implements OnModuleInit {
  logger = new Logger('MessagePollingService')
  constructor(
    private scheduleService: ScheduleService,
    private prisma: PrismaService,
    private rabbit: RabbitMqService,
  ) {}

  /**
   * This class implements a polling service that verifies if there are
   * messages scheduled for the last 5 seconds and sends them to the
   * RabbitMQ queue, that's consumed by the message sender service
   */

  onModuleInit() {
    setInterval(async () => {
      const dueMessages = await this.scheduleService.getScheduledMessages(
        new Date(),
      );

      for (const messageId of dueMessages) {
        try {
          // Fetch from DB
          const message = await this.prisma.message.findUnique({
            where: { id: messageId },
          });
          if (!message) {
            throw new BadRequestException(
              `Cannot find message with id ${messageId}`,
            );
          }
          // Publish to RabbitMQ
          await this.rabbit.publish('message.enqueue', {
            id: message.id,
            reciever: message.reciever,
            content: message.content,
          });

          // Remove from Redis
          await this.scheduleService.removeScheduledMessage(messageId);
        } catch (error) {
          this.logger.error(`Error enqueuing message for whatsapp-worker. Error: ${error}`);
        }
      }
    }, 5000);
  }
}
