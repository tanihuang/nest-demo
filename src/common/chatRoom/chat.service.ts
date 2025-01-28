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

  async getChat(
    chatRoomId: string,
    page?: number,
    pageSize?: number,
  ): Promise<Chat[]> {
    return this.chatModel
      .find({ chatRoomId: new mongoose.Types.ObjectId(chatRoomId) })
      .skip((page - 1) * pageSize) // 增加分页，跳过前面一定数量的消息
      .limit(pageSize) // 每次返回固定数量的消息
      .populate({
        path: 'user', // 填充 `createdBy` 字段
        select: 'uuid username -_id', // 只返回 `username` 字段
        match: {}, // 默认不设置其他条件
        options: { strictPopulate: false }, // 允许非 `_id` 字段的填充
      })
      .sort({ timestamp: 1 }) // 按时间戳排序 1 or -1
      .exec();
  }

  async createChat(createChatDto: CreateChatDto): Promise<Chat> {
    const { chatRoomId, createdBy, content } = createChatDto;
    this.logger.log(`createChat data: ${JSON.stringify(createChatDto)}`);
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
}
