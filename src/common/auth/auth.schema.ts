import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Schema({ collection: 'auth', timestamps: true }) // 資料庫名稱
export class Auth extends Document {
  @Prop({ required: true, unique: true, default: uuidv4 })
  uuid: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
