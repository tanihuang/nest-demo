import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Currency } from './currency.schema';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as randomUseragent from 'random-useragent';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);

  constructor(
    @InjectModel(Currency.name)
    private readonly currencyModel: Model<Currency>,
  ) {}

  onModuleInit() {
    this.getCurrencyList();
  }

  @Cron('*/10 * * * *')
  async startCronJob() {
    await this.getCurrencyList();
  }

  async getCurrencyList() {
    const res = await axios.get(
      'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
      {
        headers: {
          'X-CMC_PRO_API_KEY': 'c4cf5fc3-a72b-4096-922f-a514cd0d2bdfs',
        },
        params: {
          limit: 20,
          start: 1,
        },
      },
    );

    if (res.status === 200) {
      const data = res.data.data.map((item: any) => ({
        name: item.name,
        symbol: item.symbol,
        price: item.quote.USD.price,
        market_cap: item.quote.USD.market_cap,
        volume_24h: item.quote.USD.volume_24h,
        circulating_supply: item.circulating_supply,
        max_supply: item.max_supply,
      }));
      await this.currencyModel.deleteMany({});
      await this.currencyModel.insertMany(data);
      this.logger.log('Currency data saved successfully!');
      return data;
    } else {
      this.logger.error(`Error fetching data: ${res.status}`);
      throw new HttpException(
        'Failed to fetch currency data',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async getDcardPosts() {
    const url1 =
      'https://www.dcard.tw/service/api/v2/globalPaging/page?immersiveVideoListKey=v_popular_TW&country=TW&enrich=true&platform=web&offset=21&pageKey=7252a6a3-58a8-4ed3-b2be-83f07be7cdf9';
    const url2 = 'https://www.dcard.tw/service/api/v2/forums/talk/posts';

    try {
      await this.delay(3000);

      const res = await axios.get(url1, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept-Language': 'zh-TW,zh;q=0.9',
        },
      });

      if (res.status === 200) {
        console.log('成功獲取資料:', res.data);
      }
    } catch (error) {
      this.logger.error(
        '獲取資料時發生錯誤:',
        error.res ? error.res.status : error.message,
      );
    }
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
