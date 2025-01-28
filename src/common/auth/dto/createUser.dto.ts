import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import {
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-z])(?=.*\d).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Group' }] })
  groups: Types.ObjectId[];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Prop({ default: () => new Date() })
  registerDate: Date;
}
