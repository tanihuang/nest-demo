import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({ cors: true }) // 指定 WebSocket 路徑和 CORS 設定
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly websocketService: WebsocketService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.emit('message', 'Welcome to the WebSocket server!');
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    client: Socket,
    payload: { content: string },
  ): Promise<void> {
    console.log('Received message(node):', payload.content);
    await this.websocketService.saveWebsocket(payload.content); // 使用 Service 處理邏輯
    this.server.emit('message', payload.content); // 將消息發送給所有連接的客戶端
  }
}
