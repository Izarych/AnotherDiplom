import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() : Promise<void> {
  const app : INestApplication = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT') || 3000;
  await app.listen(PORT, () => console.log(`Сервер запустился на PORT: ${PORT}`));
}
bootstrap();
