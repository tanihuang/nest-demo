import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as moment from 'moment-timezone';

@Schema({ collection: 'chat' })
export class Chat extends Document {
  @Prop({ type: String, ref: 'Auth', required: true })
  createdBy: string;

  @Prop({ type: Types.ObjectId, ref: 'ChatRoom', required: true })
  chatRoomId: Types.ObjectId;

  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: Number, default: () => moment().tz('Asia/Taipei').toDate() })
  timestamp: number;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

ChatSchema.index({ chatRoomId: 1, timestamp: -1 });

ChatSchema.virtual('user', {
  ref: 'Auth',
  localField: 'createdBy',
  foreignField: 'uuid',
  justOne: true,
});

ChatSchema.set('toObject', { virtuals: true });
ChatSchema.set('toJSON', { virtuals: true });
