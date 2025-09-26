import { Test, TestingModule } from '@nestjs/testing';
import { NOTIFICATION_MOCK } from '../../../test/mocks/notification.mock';
import { PRODUCT_MOCK } from '../../../test/mocks/product.mock';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let notificationController: NotificationController;

  const mockNotificationService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    notificationController = module.get<NotificationController>(
      NotificationController,
    );
  });

  describe('findAll', () => {
    let paginationMock: { limit: number; page: number };
    let findAllParamsMock;
    beforeEach(() => {
      paginationMock = NOTIFICATION_MOCK.SERVICE.pagination;

      findAllParamsMock = {
        ...paginationMock,
      };
    });
    it('should findAll notifications', async () => {
      const result = await notificationController.findAll(findAllParamsMock);
      expect(result).toEqual(undefined);
      expect(mockNotificationService.findAll).toHaveBeenCalledWith(
        findAllParamsMock,
      );
    });

    it('should throw an error if findAll fails', async () => {
      mockNotificationService.findAll.mockRejectedValue(new Error('Error'));
      await expect(
        notificationController.findAll(findAllParamsMock),
      ).rejects.toThrow('Error');
    });
  });
});
