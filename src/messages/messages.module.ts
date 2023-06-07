import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from 'src/database/database.module';
import { messagesProvider } from './messages.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [MessagesController],
  providers: [...messagesProvider, MessagesService],
})
export class MessagesModule {}
