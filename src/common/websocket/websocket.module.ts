import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketGateway } from './websocket.gateway';
import { WebsocketService } from './websocket.service';
import { Websocket, WebsocketSchema } from './websocket.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Websocket.name,
        schema: WebsocketSchema,
      },
    ]),
  ],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
