import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get()
  async getCurrency() {
    return await this.currencyService.getCurrencyList();
  }
}
