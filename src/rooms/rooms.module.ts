import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { DatabaseModule } from 'src/database/database.module';
import { roomsProvider } from './rooms.providers';
import { usersProvider } from 'src/users/users.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [RoomsController],
  providers: [...roomsProvider, ...usersProvider, RoomsService],
})
export class RoomsModule {}
