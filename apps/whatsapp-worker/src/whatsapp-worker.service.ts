import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  WASocket,
} from '@whiskeysockets/baileys';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';
import { PrismaService } from 'libs/prisma/src';
import { RabbitMqService } from 'libs/rabbitmq/src';

export interface Message {
  id: string;
  reciever: string;
  content: string;
}

export enum WhatsappRabbitQueues {
  enqueueMessage = 'message.enqueue'
}

@Injectable()
export class WhatsappWorkerService implements OnModuleInit {
  private sock: WASocket | null = null;
  private readonly logger = new Logger('WhatsappWorkerService');

  constructor(
    private readonly rabbit: RabbitMqService,
    private readonly prisma: PrismaService,
  ) {}
  async onModuleInit() {
    await this.connect();
  }

  async setupConsumer() {
    await this.rabbit.consume(WhatsappRabbitQueues.enqueueMessage, async (message) => {
      await this.handleEnqueueMessage(message);
    });
    this.logger.log('Message consumer started');
  }

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState('./baileys_auth');

    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
    });

    this.sock.ev.on('creds.update', saveCreds);

    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.logger.log('Scan QR Code below:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        if (shouldReconnect) {
          this.logger.warn('Reconnecting...');
          this.connect();
        } else {
          this.logger.error('Logged out from WhatsApp');
        }
      }

      if (connection === 'open') {
        this.logger.log('WHATSAPP CONNECTED');
        await this.setupConsumer();
      }
    });
  }

  private async handleEnqueueMessage(message: Message) {
    try {
      this.logger.log(`Processing message: ${message.id}`);

      await this.sendMessage(message.reciever, message.content);

      await this.prisma.message.update({
        where: { id: message.id },
        data: { status: 'SENT', sentAt: new Date() },
      });
      this.logger.log(
        `Message ${message.id} sent successfully to ${message.reciever}`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send message ${message.id} to ${message.reciever}`,
      );
      await this.prisma.message.update({
        where: { id: message.id },
        data: { status: 'FAILED' },
      });
    }
  }

  async sendMessage(to: string, content: string) {
    if (!this.sock) {
          throw new Error('WhatsApp socket not connected');

    }
    await this.sock.sendMessage(`${to}@s.whatsapp.net`, {
      text: content,
    });
  }
}
