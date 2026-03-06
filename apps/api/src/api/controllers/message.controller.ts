import { Body, Controller, Post } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { ScheduleMessageDto } from '../dto/schedule-message.dto';

@Controller('/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/')
  async enqueueMessage(@Body() dto: CreateMessageDto) {
    return await this.messageService.enqueueMessage(dto);
  }

  @Post('/schedule')
  async scheduleMessage(@Body() dto: ScheduleMessageDto){
    return await this.messageService.scheduleMessage(dto);
  }

}
