import { Controller, Post, Get, Param, Body, Delete } from '@nestjs/common';
import { ChatRoomService } from './chatRoom.service';
import { CreateChatRoomDto } from './dto/createChatRoom.dto';
import { AddMemberDto } from './dto/addMemberDto.dto';
import { RemoveMemberDto } from './dto/removeMemberDto.dto';
@Controller('chatroom')
export class ChatRoomController {
  constructor(private readonly chatRoomService: ChatRoomService) {}

  @Post('create')
  async createChatRoom(@Body() createChatRoomDto: CreateChatRoomDto) {
    return this.chatRoomService.createChatRoom(createChatRoomDto);
  }

  @Get('user/:userId')
  async getChatRoomByUser(@Param('userId') userId: string) {
    return this.chatRoomService.getChatRoomByUser(userId);
  }

  @Post('addMember')
  async addMember(@Body() addMemberDto: AddMemberDto) {
    return this.chatRoomService.addMemberToRoom(addMemberDto);
  }

  @Delete('removeMember')
  async removeMember(@Body() removeMemberDto: RemoveMemberDto) {
    return this.chatRoomService.removeMemberFromRoom(removeMemberDto);
  }
}
