import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as moment from 'moment-timezone';

@Schema({ collection: 'chatroom' })
export class ChatRoom extends Document {
  @Prop({ type: String, ref: 'User', required: true })
  createdBy: string[];

  @Prop({
    type: [
      {
        _id: false,
        uuid: { type: String, ref: 'Auth', required: true },
        username: { type: String, required: true },
      },
    ],
    required: true,
  })
  members: Array<{
    uuid: string;
    username: string;
  }>;

  @Prop({
    type: [String],
    required: true,
  })
  membersId: string[];

  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  chatRoomId: Types.ObjectId;

  @Prop({ type: String, required: true })
  chatRoomName: string;

  @Prop({ type: String, ref: 'Auth' })
  lastMessageSender: string;

  @Prop({ type: String })
  lastMessage: string;

  @Prop({ type: Number })
  lastMessageTimestamp: number;

  @Prop({ type: Number, default: 0 })
  group: number;

  @Prop({
    type: Date,
    default: () => moment().tz('Asia/Taipei').toDate(),
    immutable: true,
  })
  createdAt: Date;

  @Prop({ type: Date, default: () => moment().tz('Asia/Taipei').toDate() })
  updatedAt: Date;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);

ChatRoomSchema.index({ membersId: 1 });
ChatRoomSchema.index({ lastMessageTimestamp: -1 });
