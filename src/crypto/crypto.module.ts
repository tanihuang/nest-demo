// import config = require('config');
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurrencyController } from './currency/currency.controller';
import { CurrencyModule } from './currency/currency.module';
import { ChatRoomModule } from '../common/chatRoom/chatRoom.module';
import { AuthModule } from 'src/common/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV || 'dev'}`],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // useFactory: async (configService: ConfigService) => ({
      //   uri: `mongodb+srv://admin:${configService.get('DB_PASSWORD')}@cluster0.fu82t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,
      //   dbName: 'crypto_dev',
      // }),
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb+srv://${configService.get('DB_USER')}:${configService.get('DB_PASSWORD')}@${configService.get('DB_HOST')}/?retryWrites=true&w=majority&appName=Cluster0`,
        dbName: configService.get('DB_NAME'),
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
