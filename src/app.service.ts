import { Injectable } from '@nestjs/common';
import { AppConfigService } from './config/app-config.service';

@Injectable()
export class AppService {
  constructor(private readonly configService: AppConfigService) {}

  getHello(): string {
    const environment = this.configService.nodeEnv;
    const port = this.configService.port;
    const apiVersion = this.configService.apiVersion || 'v1';

    return `Hello World! Running in ${environment} mode on port ${port} (API ${apiVersion})`;
  }

  getAppInfo() {
    return {
      environment: this.configService.nodeEnv,
      port: this.configService.port,
      isDevelopment: this.configService.isDevelopment,
      isProduction: this.configService.isProduction,
      apiVersion: this.configService.apiVersion,
      apiPrefix: this.configService.apiPrefix,
    };
  }
}
