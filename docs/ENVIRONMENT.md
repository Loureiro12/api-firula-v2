# Environment Configuration Guide

## Overview

This project uses environment variables for configuration management. The configuration is handled through the `@nestjs/config` package with validation using `class-validator` and `class-transformer`.

## Environment Files

- `.env` - Default environment variables for development
- `.env.example` - Template file showing all available environment variables
- `.env.local` - Local overrides (optional, has higher priority)

## Available Environment Variables

### Server Configuration
- `PORT` - Port number for the server (default: 3000)
- `NODE_ENV` - Environment mode (development, production, test)

### Database Configuration
- `DATABASE_URL` - Complete database connection string
- `DATABASE_HOST` - Database host
- `DATABASE_PORT` - Database port
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `DATABASE_NAME` - Database name

### JWT Configuration
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRATION_TIME` - Token expiration time in seconds

### API Configuration
- `API_VERSION` - API version (e.g., v1)
- `API_PREFIX` - API prefix (e.g., api)

### CORS Configuration
- `CORS_ORIGIN` - Allowed CORS origin

### Rate Limiting
- `RATE_LIMIT_TTL` - Rate limit time window in seconds
- `RATE_LIMIT_LIMIT` - Maximum requests per time window

## Setup Instructions

1. Copy the example file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

2. Edit the `.env` file with your actual values:
   \`\`\`bash
   nano .env
   \`\`\`

3. The application will automatically load and validate the environment variables on startup.

## Usage in Code

### Injecting the Configuration Service

\`\`\`typescript
import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service';

@Injectable()
export class YourService {
  constructor(private readonly configService: AppConfigService) {}

  someMethod() {
    const port = this.configService.port;
    const isDev = this.configService.isDevelopment;
    const dbUrl = this.configService.databaseUrl;
    // ... use the configuration
  }
}
\`\`\`

### Available Methods

The `AppConfigService` provides the following getters:

- `nodeEnv` - Current environment
- `port` - Server port
- `isDevelopment` - Boolean check for development mode
- `isProduction` - Boolean check for production mode
- `isTest` - Boolean check for test mode
- `databaseUrl` - Database connection URL
- `databaseHost` - Database host
- `databasePort` - Database port
- `databaseUsername` - Database username
- `databasePassword` - Database password
- `databaseName` - Database name
- `jwtSecret` - JWT secret key
- `jwtExpirationTime` - JWT expiration time
- `apiVersion` - API version
- `apiPrefix` - API prefix
- `corsOrigin` - CORS origin
- `rateLimitTtl` - Rate limit TTL
- `rateLimitLimit` - Rate limit maximum

## Validation

The application automatically validates environment variables on startup. If any required variables are missing or have invalid values, the application will fail to start with a descriptive error message.

## Security Notes

- Never commit `.env` files to version control
- Use strong, randomly generated values for secrets in production
- Keep production environment variables secure and encrypted
- Regularly rotate sensitive values like JWT secrets
