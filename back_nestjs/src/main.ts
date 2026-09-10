import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import cookieParser from 'cookie-parser'
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   // Validation
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);

    // Cookie Parser

  app.use(cookieParser())

  // CORS
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document =
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(
    'api',
    app,
    document,
  );


  await app.listen(
    process.env.PORT ?? 3000,
  );
}

bootstrap();