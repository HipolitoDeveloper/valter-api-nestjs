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
            findById: jest.fn(),
            update: jest.fn(),
            updateMany: jest.fn(),
          },
        },
      ],
    }).compile();

    notificationService = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<NotificationRepository>(
      NotificationRepository,
    );

    jest.resetAllMocks();
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

    it('should calculate correct offset for pagination', async () => {
      const paginationWithPage2 = { ...paginationMock, page: 2 };

      jest
        .spyOn(notificationRepository, 'findAll')
        .mockResolvedValue(findAllNotificationsMock);

      await notificationService.findAll(paginationWithPage2);

      expect(notificationRepository.findAll).toHaveBeenCalledWith({
        limit: paginationMock.limit,
        offset: paginationMock.limit, // limit * (page - 1) = limit * (2 - 1) = limit
      });
    });

    it('should handle undefined limit and page', async () => {
      const paginationWithoutValues = {};

      jest
        .spyOn(notificationRepository, 'findAll')
        .mockResolvedValue(findAllNotificationsMock);

      await notificationService.findAll(paginationWithoutValues);

      expect(notificationRepository.findAll).toHaveBeenCalledWith({
        limit: undefined,
        offset: undefined,
      });
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

  describe('updateNotificationDetails', () => {
    let updateDetailsDataMock;
    let existingNotificationMock;
    let updatedNotificationMock;
    let updateDetailsResponseMock;
    let pantryIdMock;
    let userIdMock;

    beforeEach(() => {
      updateDetailsDataMock =
        mocks.NOTIFICATION_MOCK.SERVICE.updateNotificationDetailsData;
      existingNotificationMock = mocks.NOTIFICATION_MOCK.REPOSITORY.findById;
      updatedNotificationMock = mocks.NOTIFICATION_MOCK.REPOSITORY.update;
      updateDetailsResponseMock =
        mocks.NOTIFICATION_MOCK.SERVICE.updateNotificationDetailsResponse;
    });

    it('should update notification details successfully', async () => {
      jest
        .spyOn(notificationRepository, 'findById')
        .mockResolvedValue(existingNotificationMock);

      jest
        .spyOn(notificationRepository, 'update')
        .mockResolvedValue(updatedNotificationMock);

      const result = await notificationService.updateNotificationDetails(
        updateDetailsDataMock,
        pantryIdMock,
        userIdMock,
      );

      expect(notificationRepository.findById).toHaveBeenCalledWith(
        updateDetailsDataMock.id,
      );
      expect(notificationRepository.update).toHaveBeenCalledWith(
        updateDetailsDataMock,
      );
      expect(result).toEqual(updateDetailsResponseMock);
    });

    it('should update notification with only isExpired', async () => {
      const dataWithOnlyIsExpired = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isExpired: true,
      };

      jest
        .spyOn(notificationRepository, 'findById')
        .mockResolvedValue(existingNotificationMock);

      jest
        .spyOn(notificationRepository, 'update')
        .mockResolvedValue(updatedNotificationMock);

      const result = await notificationService.updateNotificationDetails(
        dataWithOnlyIsExpired,
        pantryIdMock,
        userIdMock,
      );

      expect(notificationRepository.findById).toHaveBeenCalledWith(
        dataWithOnlyIsExpired.id,
      );
      expect(notificationRepository.update).toHaveBeenCalledWith(
        dataWithOnlyIsExpired,
      );
      expect(result).toEqual(updateDetailsResponseMock);
    });

    it('should update notification with only isOut', async () => {
      const dataWithOnlyIsOut = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isOut: false,
      };

      jest
        .spyOn(notificationRepository, 'findById')
        .mockResolvedValue(existingNotificationMock);

      jest
        .spyOn(notificationRepository, 'update')
        .mockResolvedValue(updatedNotificationMock);

      const result = await notificationService.updateNotificationDetails(
        dataWithOnlyIsOut,
        pantryIdMock,
        userIdMock,
      );

      expect(notificationRepository.findById).toHaveBeenCalledWith(
        dataWithOnlyIsOut.id,
      );
      expect(notificationRepository.update).toHaveBeenCalledWith(
        dataWithOnlyIsOut,
      );
      expect(result).toEqual(updateDetailsResponseMock);
    });

    it('should throw ErrorException "NOT_FOUND_ENTITY" when notification not found', async () => {
      jest.spyOn(notificationRepository, 'findById').mockResolvedValue(null);

      await expect(
        notificationService.updateNotificationDetails(
          updateDetailsDataMock,
          pantryIdMock,
          userIdMock,
        ),
      ).rejects.toThrow(new ErrorException(ERRORS.NOT_FOUND_ENTITY));

      expect(notificationRepository.update).not.toHaveBeenCalled();
    });

    it('should throw ErrorException "DATABASE_ERROR" when repository update fails', async () => {
      jest
        .spyOn(notificationRepository, 'findById')
        .mockResolvedValue(existingNotificationMock);

      jest
        .spyOn(notificationRepository, 'update')
        .mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.updateNotificationDetails(
          updateDetailsDataMock,
          '',
          '',
        ),
      ).rejects.toThrow(new ErrorException(ERRORS.DATABASE_ERROR));
    });
  });

  describe('handleRead', () => {
    let handleReadDataMock;
    let updatedNotificationsMock;
    let handleReadResponseMock;

    beforeEach(() => {
      handleReadDataMock = mocks.NOTIFICATION_MOCK.SERVICE.handleReadData;
      updatedNotificationsMock = mocks.NOTIFICATION_MOCK.REPOSITORY.updateMany;
      handleReadResponseMock =
        mocks.NOTIFICATION_MOCK.SERVICE.handleReadResponse;
    });

    it('should update multiple notifications read status successfully', async () => {
      jest
        .spyOn(notificationRepository, 'updateMany')
        .mockResolvedValue(updatedNotificationsMock);

      const result = await notificationService.handleRead(handleReadDataMock);

      expect(notificationRepository.updateMany).toHaveBeenCalledWith({
        ids: handleReadDataMock.ids,
        isRead: handleReadDataMock.isRead,
      });
      expect(result).toEqual(handleReadResponseMock);
    });

    it('should throw ErrorException "DATABASE_ERROR" when repository updateMany fails', async () => {
      const databaseError = new Error('Database connection failed');

      jest
        .spyOn(notificationRepository, 'updateMany')
        .mockRejectedValue(databaseError);

      await expect(
        notificationService.handleRead(handleReadDataMock),
      ).rejects.toThrow(new ErrorException(ERRORS.DATABASE_ERROR));
    });
  });
});
