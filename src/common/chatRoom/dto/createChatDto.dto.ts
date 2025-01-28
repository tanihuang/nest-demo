import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsDateString,
  IsArray,
} from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  chatRoomId: string;

  @IsUUID()
  @IsNotEmpty()
  createdBy: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsDateString()
  @IsNotEmpty()
  timestamp: string;
}
