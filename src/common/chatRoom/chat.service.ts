import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat } from './schema/chat.schema';
import { ChatRoom } from './schema/chatRoom.schema';
import { CreateChatDto } from './dto/createChatDto.dto';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel(Chat.name) private chatModel: Model<Chat>,
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const { chatRoomId, createdBy, content } = createChatDto;
    const message = new this.chatModel({
      ...createChatDto,
      chatRoomId: new Types.ObjectId(chatRoomId),
    });

    await message.save();
    await this.chatRoomModel.updateOne(
      { chatRoomId: new Types.ObjectId(chatRoomId) },
      {
        $set: {
          lastMessageSender: createdBy,
          lastMessage: content,
          lastMessageTimestamp: new Date(),
        },
      },
    );
    return message;
  }

  async getChat(chatRoomId: string, page = 1, pageSize = 20) {
    return this.chatModel.aggregate([
      { $match: { chatRoomId: new mongoose.Types.ObjectId(chatRoomId) } },
      {
        $lookup: {
          from: 'auth',
          localField: 'createdBy',
          foreignField: 'uuid',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          createdBy: 1,
          chatRoomId: 1,
          content: 1,
          timestamp: 1,
          user: {
            uuid: 1,
            username: 1,
          },
        },
      },
      {
        $addFields: {
          day: {
            $toLong: {
              $dateTrunc: { date: { $toDate: '$timestamp' }, unit: 'day' },
            },
          },
        },
      },
      { $sort: { timestamp: 1 } },
      {
        $group: {
          _id: '$day',
          messages: { $push: '$$ROOT' },
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (page - 1) * pageSize },
      { $limit: pageSize },
    ]);
  }
}
