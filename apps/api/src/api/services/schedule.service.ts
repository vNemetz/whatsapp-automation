import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class ScheduleService {
  logger = new Logger('ScheduleService');
  redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6380'),
    });
  }

  async scheduleMessage(messageId: string, scheduledAt: Date) {
    this.logger.log(
      `Scheduling message ${messageId} to be sent at ${scheduledAt}`,
    );
    const timeKey = scheduledAt.getTime();

    const scheduleKey = await this.redis.zadd(
      'schedule:message',
      timeKey,
      messageId,
    );

    this.logger.log(`Successfully scheduled message ${messageId}`);
    return scheduleKey;
  }

  async getScheduledMessages(currentDate: Date) {
    const currentTimestamp = currentDate.getTime();

    const scheduledMessages = await this.redis.zrangebyscore(
      'schedule:message',
      '-inf',
      currentTimestamp,
    );
    return scheduledMessages;
  }

  async removeScheduledMessage(messageId: string) {
    this.logger.log(`Removing message ${messageId} from Redis schedule queue`);
    return await this.redis.zrem('schedule:message', messageId);
  }
}
