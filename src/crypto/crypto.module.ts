// import config = require('config');
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurrencyController } from './currency/currency.controller';
import { CurrencyModule } from './currency/currency.module';
import { WebsocketModule } from '../common/websocket/websocket.module';
import { ChatRoomModule } from '../common/chatRoom/chatRoom.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.stage.${process.env.STAGE}`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://admin:${configService.get('DB_PASSWORD')}@cluster0.fu82t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
        dbName: 'crypto_dev',
      }),
    }),
    CurrencyModule,
    AuthModule,
    // WebsocketModule,
    ChatRoomModule,
  ],
  controllers: [CurrencyController],
  providers: [],
})
export class CryptoModule {}
