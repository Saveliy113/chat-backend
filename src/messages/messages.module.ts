import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { DatabaseModule } from 'src/database/database.module';
import { messagesProvider } from './messages.providers';
import { MessagesGateway } from './messages.gateway';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [DatabaseModule, UsersModule, JwtModule],
  controllers: [MessagesController],
  providers: [...messagesProvider, MessagesService, MessagesGateway],
})
export class MessagesModule {}
