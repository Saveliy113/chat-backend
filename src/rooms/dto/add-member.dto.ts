import { IsNotEmpty } from 'class-validator';

export class AddMemberDto {
  @IsNotEmpty()
  memberId: number;

  @IsNotEmpty()
  roomId: number;
}
