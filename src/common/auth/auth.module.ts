import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Auth, AuthSchema } from './auth.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: 'defaultSecretKey',
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService], // Export the service if you need it in other modules
})
export class AuthModule {}
