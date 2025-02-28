import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatRoom } from './schema/chatRoom.schema';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { AddMemberDto } from './dto/addMemberDto.dto';
import { RemoveMemberDto } from './dto/removeMemberDto.dto';
import { Types } from 'mongoose';

@Injectable()
export class ChatRoomService {
  private readonly logger = new Logger(ChatRoomService.name);

  constructor(
    @InjectModel(ChatRoom.name) private chatRoomModel: Model<ChatRoom>,
  ) {}

  async createChatRoom(
    createChatRoomDto: CreateChatRoomDto,
  ): Promise<ChatRoom> {
    const { members } = createChatRoomDto;
    const parseMembers = members.map((item) => item.uuid);
    const chatRoom = new this.chatRoomModel({
      ...createChatRoomDto,
      chatRoomId: new Types.ObjectId(),
      membersId: parseMembers,
    });
    return chatRoom.save();
  }

  async getChatRoomByUser(userId: string): Promise<ChatRoom[]> {
    return this.chatRoomModel.find({ membersId: userId }).exec();
  }

  async getChatRoomByMembers(
    createdBy: string,
    members: Array<{ uuid: string; username: string }>,
  ): Promise<ChatRoom | null> {
    const parseMembers = members.map((item) => item.uuid);
    return this.chatRoomModel
      .findOne({
        'members.uuid': { $all: parseMembers },
        $expr: { $eq: [{ $size: '$members' }, members.length] },
      })
      .exec();
  }

  async addMemberToRoom(addMemberDto: AddMemberDto): Promise<ChatRoom> {
    const { chatRoomId, userId, username } = addMemberDto;

    const chatRoom = await this.chatRoomModel.findById(chatRoomId);
    if (!chatRoom) {
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);
    }

    if (chatRoom.members.some((item: any) => item.uuid === userId)) {
      throw new HttpException(
        'User already a member of this chat room',
        HttpStatus.BAD_REQUEST,
      );
    }

    chatRoom.members.push({ uuid: userId, username });

    return chatRoom.save();
  }

  async removeMemberFromRoom(
    removeMemberDto: RemoveMemberDto,
  ): Promise<ChatRoom> {
    const { chatRoomId, userId } = removeMemberDto;

    const chatRoom = await this.chatRoomModel.findById(chatRoomId);
    if (!chatRoom) {
      throw new HttpException('Chat room not found', HttpStatus.NOT_FOUND);
    }

    chatRoom.members = chatRoom.members.filter((item) => item.uuid !== userId);

    return chatRoom.save();
  }
}
