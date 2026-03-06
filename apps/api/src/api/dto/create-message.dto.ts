export class CreateMessageDto {
  sender: string;
  reciever: string;
  content: string;
  scheduledAt: Date;
}
