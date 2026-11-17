import { NestFactory } from '@nestjs/core';
import * as crypto from 'crypto';

if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = { 
    getRandomValues: crypto.webcrypto?.getRandomValues.bind(crypto.webcrypto),
    randomUUID: crypto.randomUUID.bind(crypto)
  };
}

import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, context }) =>
            `${timestamp} [${context ?? 'App'}] ${level}: ${message}`,
        ),
      ),
    }),
  ],
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: winstonLogger });
  const logger = new Logger('Bootstrap');

  // Graceful shutdown
  app.enableShutdownHooks();

  // Global Prefix
  app.setGlobalPrefix('api');

  // Global Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Security Middleware
  app.use(helmet());
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://localhost:3030', // New frontend port
    ].filter(Boolean),
    credentials: true,
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('RENTABLE API')
    .setDescription('The RENTABLE Premium Product Rental Marketplace API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 5000;
  await app.listen(port);
  logger.log(`🚀 Rentable API running on: ${await app.getUrl()}`);
  logger.log(`📚 Swagger docs: ${await app.getUrl()}/api/docs`);
}
bootstrap();
