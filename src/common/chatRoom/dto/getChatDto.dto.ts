import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';

export class GetChatDto {
  @IsUUID()
  @IsNotEmpty()
  chatRoomId: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number;
}
