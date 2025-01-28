import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsResponse,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatRoomService } from './chatRoom.service';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/createChatDto.dto';
import { GetChatDto } from './dto/getChatDto.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: '/chatroom', cors: true })
// @WebSocketGateway({ namespace: '/chatroom', cors: { origin: '*' } })
export class ChatRoomGateway {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatRoomGateway.name);

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('createChatRoom')
  async handleCreateChatRoom(
    @MessageBody() createChatRoomDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { createdBy, members } = createChatRoomDto;

    const existingChatRoom = await this.chatRoomService.getChatRoomByMembers(
      createdBy,
      members,
    );

    this.logger.log(`createChatRoom1: ${existingChatRoom}`);

    if (existingChatRoom) {
      client.emit('getError', existingChatRoom);
      return;
    }

    const chatRoom =
      await this.chatRoomService.createChatRoom(createChatRoomDto);
    this.logger.log(`createChatRoom2: ${chatRoom}`);

    client.emit('updateChatRoomList', chatRoom);
  }

  @SubscribeMessage('getChatRoom')
  async handleGetChatRoom(@MessageBody() userId: string) {
    this.logger.log(`Received getChatRoom event for userId: ${userId}`);
    const chatRooms = await this.chatRoomService.getChatRoomByUser(userId);
    this.server.emit('getChatRoom', chatRooms);
  }

  @SubscribeMessage('addMemberToRoom')
  async handleAddMember(
    @MessageBody() addMemberDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chatRoom = await this.chatRoomService.addMemberToRoom(addMemberDto);
    this.server.emit('updateChatRoom', chatRoom);
  }

  @SubscribeMessage('removeMemberFromRoom')
  async handleRemoveMember(
    @MessageBody() removeMemberDto,
    @ConnectedSocket() client: Socket,
  ) {
    const chatRoom =
      await this.chatRoomService.removeMemberFromRoom(removeMemberDto);
    this.server.emit('updateChatRoom', chatRoom);
  }

  @SubscribeMessage('createChat')
  async handleCreateChat(
    @MessageBody() createChatDto: CreateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.log(`Received message: ${createChatDto}`);
    const message = await this.chatService.createChat(createChatDto);
    this.server.to(createChatDto.chatRoomId).emit('message', message);
    client.emit('createChat', message);
  }

  @SubscribeMessage('getChat')
  async handleGetChat(
    @MessageBody() getChatDto: GetChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, page = 1, pageSize = 20 } = getChatDto;
    const message = await this.chatService.getChat(chatRoomId, page, pageSize);
    this.server.to(getChatDto.chatRoomId).emit('message', message);
    client.emit('getChat', message);
  }
}
