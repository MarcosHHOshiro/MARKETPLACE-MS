import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*', // Permitir todas as origens (ajuste conforme necessário)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança um erro se houver propriedades não definidas no DTO
      transform: true, // Transforma os payloads para os tipos definidos nos DTOs
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('API Gateway para o Marketplace')
    .setVersion('1.0')
    .addBearerAuth() // Adiciona suporte para autenticação Bearer
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    console.log(`API Gateway is running on port ${port}`);
  });
}
bootstrap();
