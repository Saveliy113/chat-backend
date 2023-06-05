import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [UsersModule, RoomsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
