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
export class ChatRoomGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatRoomGateway.name);
  private socketMap = new Map<string, string>();

  constructor(
    private readonly chatRoomService: ChatRoomService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
  }

  handleConnection(client: Socket) {
    const uuid = client.handshake.query.uuid as string;
    if (uuid) {
      this.socketMap.set(uuid, client.id);
    }
    this.logger.log(`handleConnection`);
  }

  handleDisconnect(client: Socket) {
    [...this.socketMap.entries()].forEach(([uuid, socketId]) => {
      if (socketId === client.id) this.socketMap.delete(uuid);
    });
    this.logger.log(`handleDisconnect`);
  }

  private async handleSocket(members: any[], chatRoomId: string) {
    const activeSocket = new Map(
      (await this.server.fetchSockets()).map((item) => [item.id, item]),
    );
    await Promise.all(
      members.map(async ({ uuid }) => {
        const socketId = this.socketMap.get(uuid);
        const socket = activeSocket.get(socketId);
        if (socket) await socket.join(chatRoomId);
      }),
    );
  }

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

    if (existingChatRoom) {
      client.emit('getError', existingChatRoom);
      return;
    }

    const chatRoom =
      await this.chatRoomService.createChatRoom(createChatRoomDto);
    const chatRoomId = chatRoom.chatRoomId.toString();

    // client.join(chatRoomId);
    // client.emit('updateChatRoomList', chatRoom);
    await this.handleSocket(members, chatRoomId);
    this.server.to(chatRoomId).emit('updateChatRoomList', chatRoom);
  }

  @SubscribeMessage('getChatRoomList')
  async handleGetChatRoom(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const chatRooms = await this.chatRoomService.getChatRoomByUser(userId);
    chatRooms.forEach((item) => {
      client.join(item.chatRoomId.toString());
    });
    client.emit('getChatRoomList', chatRooms);
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
    const message = await this.chatService.createChat(createChatDto);

    this.server
      .to(createChatDto.chatRoomId.toString())
      .emit('updateChatList', message);
  }

  @SubscribeMessage('getChat')
  async handleGetChat(
    @MessageBody() getChatDto: GetChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { chatRoomId, page = 1, pageSize = 20 } = getChatDto;
    const messages = await this.chatService.getChat(chatRoomId, page, pageSize);
    this.logger.log(`getChat gateway: ${JSON.stringify(messages)}`);
    client.emit('getChat', messages);
  }
}
