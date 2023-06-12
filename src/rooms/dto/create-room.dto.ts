import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserEntity } from 'src/users/entities/user.entity';

export class CreateRoomDto {
  @IsNotEmpty()
  title: string;

  description?: string;

  @IsOptional()
  participants: UserEntity[];
}
