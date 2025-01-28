import { IsUUID, IsString } from 'class-validator';

export class AddMemberDto {
  @IsUUID()
  chatRoomId: string;

  @IsUUID()
  userId: string;

  @IsString()
  username: string;
}
