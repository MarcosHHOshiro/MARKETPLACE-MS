import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false, // Desabilita COEP para evitar bloqueios de recursos de terceiros
      hsts: {
        maxAge: 31536000, // 1 ano
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
      if (!origin) return callback(null, true); // Permitir requisições sem origem (como Postman)

      const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || ['*'];

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(null, true);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders:
      'Content-Type, Authorization, X-Requested-With, Accept, Origin, Access-Control-Request-Headers, Access-Control-Request-Method', // Cabeçalhos permitidos
    credentials: true, // Permitir envio de cookies e credenciais
    maxAge: 86400, // Cache da resposta pré-flight por 24 horas
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
