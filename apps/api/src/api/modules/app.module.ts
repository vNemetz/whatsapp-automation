import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MessageModule } from './message.module';

@Module({
  imports: [ConfigModule.forRoot(), MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
