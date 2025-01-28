import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform.interceptor';
import { CryptoModule } from './crypto/crypto.module';

async function bootstrap() {
  const moduleObj = {
    app: AppModule,
    crypto: CryptoModule,
  };
  const Module = moduleObj[process.env.SERVER_NAME] || AppModule;
  const logger = new Logger();
  const app = await NestFactory.create(Module, { cors: true });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  const port = 3000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
