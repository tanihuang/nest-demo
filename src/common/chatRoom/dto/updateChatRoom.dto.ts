import {
  IsString,
  IsUUID,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class UpdateChatRoomDto {
  @IsUUID()
  @IsOptional()
  chatRoomId?: string;

  @IsString()
  @IsOptional()
  chatRoomName?: string;

  @IsUUID()
  @IsOptional()
  lastMessageSender?: string;

  @IsString()
  @IsOptional()
  lastMessage?: string;

  @IsDateString()
  @IsOptional()
  lastMessageTimestamp?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
