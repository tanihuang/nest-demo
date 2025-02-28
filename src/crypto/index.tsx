import axios from 'axios';
import * as cheerio from 'cheerio';

export const aiscoreBaseball = async () => {
  try {
    const response = await axios.get('https://www.aiscore.com/zht/baseball');
    console.log('test', response.data);

    const $ = cheerio.load(response.data);

    const title = $('title').text();
    console.log('Page Title:', title);
  } catch (error) {
    console.error('Error fetching the URL:', error);
  }
};

aiscoreBaseball();
