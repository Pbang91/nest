import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, //DTO에 있는것만 받아주자
    forbidNonWhitelisted: true, //DTO에 없으면 request도 받지 말자
    transform: true, //path parameter(route parameter)를 타입에 맞게 변환해주자
  }));
  await app.listen(3000);
}
bootstrap();