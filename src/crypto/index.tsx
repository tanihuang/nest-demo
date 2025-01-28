import axios from 'axios';
import * as cheerio from 'cheerio';

export const aiscoreBaseball = async () => {
  try {
    const response = await axios.get('https://www.aiscore.com/zht/baseball');
    console.log('test', response.data);

    // 使用 cheerio 解析 HTML
    const $ = cheerio.load(response.data);

    // 示例：获取网页标题
    const title = $('title').text();
    console.log('Page Title:', title);
  } catch (error) {
    console.error('Error fetching the URL:', error);
  }
};

// 调用函数
aiscoreBaseball();
