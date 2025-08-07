import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
    .addTag('users', 'User management endpoints')
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
