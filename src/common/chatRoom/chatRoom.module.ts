import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomGateway } from './chatRoom.gateway';
import { ChatRoomService } from './chatRoom.service';
import { ChatService } from './chat.service';
import { Chat, ChatSchema } from './schema/chat.schema';
import { ChatRoom, ChatRoomSchema } from './schema/chatRoom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, schema: ChatSchema },
      { name: ChatRoom.name, schema: ChatRoomSchema },
    ]),
  ],
  providers: [ChatRoomGateway, ChatRoomService, ChatService],
})
export class ChatRoomModule {}
