import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationModule } from './notification.module';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

describe('NotificationModule', () => {
  let notificationService: NotificationService;
  let notificationController: NotificationController;
  let notificationRepository: NotificationRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    notificationController = module.get<NotificationController>(
      NotificationController,
    );
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );
  });

  it('should be defined', () => {
    expect(notificationService).toBeDefined();
    expect(notificationController).toBeDefined();
    expect(notificationRepository).toBeDefined();
  });

  it('should provide NotificationService', () => {
    expect(notificationService).toBeInstanceOf(NotificationService);
  });

  it('should provide NotificationController', () => {
    expect(notificationController).toBeInstanceOf(NotificationController);
  });

  it('should provide NotificationRepository', () => {
    expect(notificationRepository).toBeInstanceOf(NotificationRepository);
  });
});
