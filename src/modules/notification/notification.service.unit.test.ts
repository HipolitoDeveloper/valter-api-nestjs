import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let notificationService: NotificationService;
  let notificationRepository: NotificationRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: {
            findAll: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );
  });

  describe('findAll', () => {
    let notificationsMock;
    let paginationMock;
    let findAllNotificationsMock;

    beforeEach(() => {
      paginationMock = mocks.NOTIFICATION_MOCK.SERVICE.pagination;
      notificationsMock = mocks.NOTIFICATION_MOCK.SERVICE.findAllResponse;
      findAllNotificationsMock = mocks.NOTIFICATION_MOCK.REPOSITORY.findAll;
    });
    it('should findAll notifications', async () => {
      jest
        .spyOn(notificationRepository, 'findAll')
        .mockResolvedValue(findAllNotificationsMock);

      const result = await notificationService.findAll(paginationMock);

      expect(notificationRepository.findAll).toHaveBeenCalledWith({
        limit: paginationMock.limit,
        offset: 0,
      });
      expect(result).toEqual(notificationsMock);
    });

    it('should throw ErrorException "DATABASE_ERROR" if findAll fails', async () => {
      jest
        .spyOn(notificationRepository, 'findAll')
        .mockRejectedValue(new Error());

      await expect(notificationService.findAll(paginationMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });
});
