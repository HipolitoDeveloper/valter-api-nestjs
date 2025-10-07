import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { NotificationExpiresConfig } from './notification-expires.config';
import { NotificationExpiresModule } from './notification-expires.module';
import { NotificationExpiresService } from './notification-expires.service';

describe('NotificationExpiresModule', () => {
  let notificationExpiresService: NotificationExpiresService;
  let notificationExpiresConfig: NotificationExpiresConfig;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationExpiresModule],
    }).compile();

    notificationExpiresService = module.get<NotificationExpiresService>(
      NotificationExpiresService,
    );
    notificationExpiresConfig = module.get<NotificationExpiresConfig>(
      NotificationExpiresConfig,
    );
  });

  it('should be defined', () => {
    expect(notificationExpiresService).toBeDefined();
    expect(notificationExpiresConfig).toBeDefined();
  });

  it('should provide NotificationExpiresService', () => {
    expect(notificationExpiresService).toBeInstanceOf(NotificationService);
  });

  it('should provide NotificationExpiresConfig', () => {
    expect(notificationExpiresConfig).toBeInstanceOf(notificationExpiresConfig);
  });

});
