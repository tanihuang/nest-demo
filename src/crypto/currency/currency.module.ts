import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { CurrencyController } from './currency.controller';
import { CurrencyService } from './currency.service';
import { Currency, CurrencySchema } from './currency.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      {
        name: Currency.name,
        schema: CurrencySchema,
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [CurrencyService], // Export the service if you need it in other modules
})
export class CurrencyModule {}
