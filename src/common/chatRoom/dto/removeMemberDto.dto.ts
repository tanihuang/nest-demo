import { IsUUID } from 'class-validator';

export class RemoveMemberDto {
  @IsUUID()
  chatRoomId: string;

  @IsUUID()
  userId: string;
}
