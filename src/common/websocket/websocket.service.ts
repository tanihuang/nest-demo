import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Websocket } from './websocket.schema';

@Injectable()
export class WebsocketService {
  private readonly logger = new Logger(WebsocketService.name);

  constructor(
    @InjectModel(Websocket.name)
    private readonly websocketModel: Model<Websocket>,
  ) {}

  async getWebsocket() {
    try {
      return await this.websocketModel.find().exec();
    } catch (error) {
      this.logger.error('Failed to fetch web sockets', error);
      throw new HttpException(
        'Failed to fetch web sockets',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveWebsocket(content: string) {
    const newMessage = new this.websocketModel({ content });
    try {
      await this.websocketModel.deleteMany({});
      const savedMessage = await newMessage.save();
      return savedMessage.toObject();
    } catch (error) {
      this.logger.error('Failed to save websocket message', error);
      throw new HttpException(
        'Failed to save websocket message',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
