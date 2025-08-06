import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables, Environment } from './environment.config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService<EnvironmentVariables>) {}

  get nodeEnv(): Environment {
    return (
      this.configService.get('NODE_ENV', { infer: true }) ||
      Environment.Development
    );
  }

  get port(): number {
    return this.configService.get('PORT', { infer: true }) || 3000;
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === Environment.Development;
  }

  get isProduction(): boolean {
    return this.nodeEnv === Environment.Production;
  }

  get isTest(): boolean {
    return this.nodeEnv === Environment.Test;
  }

  // Database
  get databaseUrl(): string | undefined {
    return this.configService.get('DATABASE_URL', { infer: true });
  }

  get databaseHost(): string | undefined {
    return this.configService.get('DATABASE_HOST', { infer: true });
  }

  get databasePort(): number | undefined {
    return this.configService.get('DATABASE_PORT', { infer: true });
  }

  get databaseUsername(): string | undefined {
    return this.configService.get('DATABASE_USERNAME', { infer: true });
  }

  get databasePassword(): string | undefined {
    return this.configService.get('DATABASE_PASSWORD', { infer: true });
  }

  get databaseName(): string | undefined {
    return this.configService.get('DATABASE_NAME', { infer: true });
  }

  // JWT
  get jwtSecret(): string | undefined {
    return this.configService.get('JWT_SECRET', { infer: true });
  }

  get jwtExpirationTime(): number | undefined {
    return this.configService.get('JWT_EXPIRATION_TIME', { infer: true });
  }

  // API
  get apiVersion(): string | undefined {
    return this.configService.get('API_VERSION', { infer: true });
  }

  get apiPrefix(): string | undefined {
    return this.configService.get('API_PREFIX', { infer: true });
  }

  // CORS
  get corsOrigin(): string | undefined {
    return this.configService.get('CORS_ORIGIN', { infer: true });
  }

  // Rate Limiting
  get rateLimitTtl(): number | undefined {
    return this.configService.get('RATE_LIMIT_TTL', { infer: true });
  }

  get rateLimitLimit(): number | undefined {
    return this.configService.get('RATE_LIMIT_LIMIT', { infer: true });
  }
}
