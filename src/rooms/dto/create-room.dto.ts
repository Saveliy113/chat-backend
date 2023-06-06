import { Length } from 'class-validator';

export class CreateRoomDto {
  @Length(1)
  title: string;

  description?: string;
}
