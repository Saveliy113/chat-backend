import { Length } from 'class-validator';

export class CreateMessageDto {
  @Length(1)
  text: string;
}
