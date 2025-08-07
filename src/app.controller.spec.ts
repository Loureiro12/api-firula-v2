import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigService } from './config/app-config.service';

describe('AppController', () => {
  let appController: AppController;

  // Mock AppConfigService
  const mockAppConfigService = {
    nodeEnv: 'test',
    port: 3000,
    apiVersion: 'v1',
    isDevelopment: true,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: AppConfigService,
          useValue: mockAppConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toContain('Hello World!');
      expect(result).toContain('test mode');
      expect(result).toContain('port 3000');
      expect(result).toContain('API v1');
    });
  });
});
