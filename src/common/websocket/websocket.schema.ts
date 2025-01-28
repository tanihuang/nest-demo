import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as moment from 'moment-timezone';

@Schema({ collection: 'websocket' })
export class Websocket extends Document {
  @Prop({ required: true })
  content: string;

  @Prop({
    default: () => moment().tz('Asia/Taipei').format('YYYY-MM-DD HH:mm:ss'),
  })
  timestamp: Date;
}

export const WebsocketSchema = SchemaFactory.createForClass(Websocket);
