import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsUUID,
  IsBoolean,
  IsOptional,
  ValidateNested,
  IsInt,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Types } from 'mongoose';

export class CreateChatRoomDto {
  @IsUUID()
  @IsNotEmpty()
  createdBy: Types.ObjectId;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @IsNotEmpty()
  members: Array<{
    uuid: string;
    username: string;
  }>;

  @IsString()
  @IsOptional()
  chatRoomName?: string;

  @IsUUID()
  @IsOptional()
  lastMessageSender?: string;

  @IsString()
  @IsOptional()
  lastMessage?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  group: number;
}
