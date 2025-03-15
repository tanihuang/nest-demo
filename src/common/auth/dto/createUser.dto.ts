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

  @IsString({ message: 'Password must be a string.' })
  @MinLength(8, { message: 'At least 8 characters.' })
  @MaxLength(32, { message: 'Max 32 characters.' })
  @Matches(/^(?=.*[a-z])(?=.*\d).*$/, {
    message: 'A minimum of 1 lower case letter and number.',
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
