import { Injectable, Logger } from '@nestjs/common';
import { CreateMessageDto } from '../dto/create-message.dto';
import { PrismaService } from '../../../../../libs/prisma/src/prisma.service';
import { RabbitMqService } from '../../../../../libs/rabbitmq/src/rabbitmq.service';
import { ScheduleMessageDto } from '../dto/schedule-message.dto';
import { ScheduleService } from './schedule.service';

@Injectable()
export class MessageService {
  logger = new Logger('MessageService');
  constructor(
    private readonly prisma: PrismaService,
    private readonly rabbit: RabbitMqService,
    private readonly scheduleService: ScheduleService,
  ) {}

  async straightEnqueueMessage(dto: CreateMessageDto) {
    //Send message now
    const scheduledAt = new Date();

    const message = await this.prisma.message.create({
      data: {
        ...dto,
        scheduledAt,
        status: 'SCHEDULED',
      },
    });

    await this.rabbit.publish('message.enqueue', {
      id: message.id,
      reciever: message.reciever,
      content: message.content,
    });

    return message;
  }

  async scheduleMessage(dto: ScheduleMessageDto) {
    const { sender, reciever, content } = dto;
    const scheduledAt = new Date(dto.scheduledAt);
    this.logger.log(
      `Started scheduling message from sender ${sender} to reciever ${reciever}`,
    );

    const message = await this.prisma.message.create({
      data: {
        sender,
        reciever,
        scheduledAt,
        content,
        status: 'SCHEDULED',
      },
    });

    return await this.scheduleService.scheduleMessage(message.id, scheduledAt);
  }
}
