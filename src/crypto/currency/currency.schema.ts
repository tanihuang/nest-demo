import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'currency' })
export class Currency extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  symbol?: string;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  market_cap: string;

  @Prop({ required: true })
  volume_24h: string;

  @Prop({ required: true })
  circulating_supply: string;

  @Prop({ required: true })
  max_supply: string;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
