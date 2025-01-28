import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChatDto.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() createChatDto: CreateChatDto) {
    return this.chatService.createChat(createChatDto);
  }

  @Get('room/:chatRoomId')
  async getMessages(@Param('chatRoomId') chatRoomId: string) {
    return this.chatService.getChat(chatRoomId);
  }
}
