import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configure global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Lança erro se propriedades não permitidas forem enviadas
      transform: true, // Transforma automaticamente os tipos
      transformOptions: {
        enableImplicitConversion: true, // Converte tipos automaticamente
      },
    }),
  );

  // Configure global exception filter for validation errors
  app.useGlobalFilters(new ValidationExceptionFilter());

  const configService = app.get(AppConfigService);
  const port = configService.port;

  // Configure CORS if needed
  const corsOrigin = configService.corsOrigin;
  if (corsOrigin) {
    app.enableCors({
      origin: corsOrigin,
      credentials: true,
    });
  }

  // Set global prefix if configured
  const apiPrefix = configService.apiPrefix;
  if (apiPrefix) {
    app.setGlobalPrefix(apiPrefix);
  }

  // Setup Swagger
  const config = new DocumentBuilder()
    .setTitle('API Firula v2')
    .setDescription('API documentation for Firula v2')
    .setVersion('2.0')
    .addTag('User Creation', 'User creation endpoint with email validation')
    .addTag('users', 'User management endpoints (CRUD operations)')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(
    `Swagger documentation available at: http://localhost:${port}/api`,
  );
}
bootstrap().catch((error) => {
  console.error('Error starting application:', error);
  process.exit(1);
});
