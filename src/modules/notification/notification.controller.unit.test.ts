import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NOTIFICATION_MOCK } from '../../../test/mocks/notification.mock';

describe('NotificationController', () => {
  let notificationController: NotificationController;

  const mockNotificationService = {
    findAll: jest.fn(),
    updateNotificationDetails: jest.fn(),
    handleRead: jest.fn(),
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
      paginationMock = mocks.NOTIFICATION_MOCK.SERVICE.pagination;

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

  describe('updateNotificationDetails', () => {
    let updateDetailsDataMock;
    let updateNotificationDetailsResponseMock;
    let request;

    beforeEach(() => {
      updateDetailsDataMock =
        NOTIFICATION_MOCK.SERVICE.updateNotificationDetailsData;
      updateNotificationDetailsResponseMock =
        NOTIFICATION_MOCK.SERVICE.updateNotificationDetailsResponse;
    });

    it('should update notification details successfully', async () => {
      mockNotificationService.updateNotificationDetails.mockResolvedValue(
        updateNotificationDetailsResponseMock,
      );

      const result = await notificationController.updateNotificationDetails(
        request,
        updateDetailsDataMock,
      );

      expect(result).toEqual(updateNotificationDetailsResponseMock);
      expect(
        mockNotificationService.updateNotificationDetails,
      ).toHaveBeenCalledWith(updateDetailsDataMock);
    });

    it('should update notification with only isExpired', async () => {
      const dataWithOnlyIsExpired = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isExpired: true,
      };

      mockNotificationService.updateNotificationDetails.mockResolvedValue(
        updateNotificationDetailsResponseMock,
      );

      const result = await notificationController.updateNotificationDetails(
        dataWithOnlyIsExpired,
        request
      );

      expect(result).toEqual(updateNotificationDetailsResponseMock);
      expect(
        mockNotificationService.updateNotificationDetails,
      ).toHaveBeenCalledWith(dataWithOnlyIsExpired);
    });

    it('should update notification with only isOut', async () => {
      const dataWithOnlyIsOut = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isOut: false,
      };

      mockNotificationService.updateNotificationDetails.mockResolvedValue(
        updateNotificationDetailsResponseMock,
      );

      const result = await notificationController.updateNotificationDetails(
        dataWithOnlyIsOut,
        request,
      );

      expect(result).toEqual(updateNotificationDetailsResponseMock);
      expect(
        mockNotificationService.updateNotificationDetails,
      ).toHaveBeenCalledWith(dataWithOnlyIsOut);
    });

    it('should throw an error if updateNotificationDetails fails', async () => {
      mockNotificationService.updateNotificationDetails.mockRejectedValue(
        new Error('Update failed'),
      );

      await expect(
        notificationController.updateNotificationDetails(
          updateDetailsDataMock,
          request,
        ),
      ).rejects.toThrow('Update failed');
    });
  });

  describe('handleRead', () => {
    let handleReadDataMock;
    let handleReadResponseMock;

    beforeEach(() => {
      handleReadDataMock = NOTIFICATION_MOCK.SERVICE.handleReadData;
      handleReadResponseMock = NOTIFICATION_MOCK.SERVICE.handleReadResponse;
    });

    it('should update notification read status successfully', async () => {
      mockNotificationService.handleRead.mockResolvedValue(
        handleReadResponseMock,
      );

      const result =
        await notificationController.handleRead(handleReadDataMock);

      expect(result).toEqual(handleReadResponseMock);
      expect(mockNotificationService.handleRead).toHaveBeenCalledWith(
        handleReadDataMock,
      );
    });

    it('should handle read status as false', async () => {
      const handleReadDataFalse = {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isRead: false,
      };

      mockNotificationService.handleRead.mockResolvedValue(
        handleReadResponseMock,
      );

      const result =
        await notificationController.handleRead(handleReadDataFalse);

      expect(result).toEqual(handleReadResponseMock);
      expect(mockNotificationService.handleRead).toHaveBeenCalledWith(
        handleReadDataFalse,
      );
    });

    it('should throw an error if handleRead fails', async () => {
      mockNotificationService.handleRead.mockRejectedValue(
        new Error('Handle read failed'),
      );

      await expect(
        notificationController.handleRead(handleReadDataMock),
      ).rejects.toThrow('Handle read failed');
    });
  });
});
