import { Test, TestingModule } from '@nestjs/testing';
import { SHOPLIST_MOCK } from '../../../test/mocks/shoplist.mock';
import { USER_MOCK } from '../../../test/mocks/user.mock';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { Request } from '../../common/types/http.type';
import { ShoplistController } from './shoplist.controller';
import { ShoplistService } from './shoplist.service';
import { ShoplistControllerNamespace } from './shoplist.type';
import CreateShoplistBody = ShoplistControllerNamespace.CreateShoplistBody;
import UpdateShoplistBody = ShoplistControllerNamespace.UpdateShoplistBody;

describe('ShoplistController', () => {
  let shoplistController: ShoplistController;

  const mockShoplistService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShoplistController],
      providers: [
        {
          provide: ShoplistService,
          useValue: mockShoplistService,
        },
        ExceptionHandler,
      ],
    }).compile();

    shoplistController = module.get<ShoplistController>(ShoplistController);
  });

  describe('create', () => {
    let createShoplistBody: CreateShoplistBody;

    beforeEach(() => {
      createShoplistBody = SHOPLIST_MOCK.SERVICE.createShoplistBody;
    });

    it('should create a shoplist', async () => {
      const result = await shoplistController.create(createShoplistBody);
      expect(result).toEqual(undefined);
      expect(mockShoplistService.create).toHaveBeenCalledWith(
        createShoplistBody,
      );
    });

    it('should throw an error if shoplist creation fails', async () => {
      mockShoplistService.create.mockRejectedValue(new Error('Error'));
      await expect(
        shoplistController.create(createShoplistBody),
      ).rejects.toThrow('Error');
    });
  });

  describe('update', () => {
    let updateShoplistBody: UpdateShoplistBody;
    let currentUser;

    beforeEach(() => {
      updateShoplistBody = SHOPLIST_MOCK.SERVICE.updateShoplistBody;
      currentUser = USER_MOCK.currentUser;
    });
    it('should update a shoplist', async () => {
      const result = await shoplistController.update(
        { ...updateShoplistBody },
        { currentUser: currentUser } as Request,
      );
      expect(result).toEqual(undefined);
      expect(mockShoplistService.update).toHaveBeenCalledWith(
        {
          ...updateShoplistBody,
        },
        currentUser.pantryId,
        undefined,
        currentUser.id,
      );
    });

    it('should throw an error if shoplist creation fails', async () => {
      mockShoplistService.update.mockRejectedValue(new Error('Error'));
      await expect(
        shoplistController.update(updateShoplistBody, {
          currentUser,
        } as Request),
      ).rejects.toThrow('Error');
    });
  });

  describe('findOne', () => {
    let shoplistIdMock: string;

    beforeEach(() => {
      shoplistIdMock = SHOPLIST_MOCK.SERVICE.shoplistId;
    });
    it('should finddOne shoplist', async () => {
      const result = await shoplistController.findOne({ id: shoplistIdMock });
      expect(result).toEqual(undefined);
      expect(mockShoplistService.findOne).toHaveBeenCalledWith(shoplistIdMock);
    });

    it('should throw an error if shoplist creation fails', async () => {
      mockShoplistService.findOne.mockRejectedValue(new Error('Error'));
      await expect(
        shoplistController.findOne({ id: shoplistIdMock }),
      ).rejects.toThrow('Error');
    });
  });

  describe('findAll', () => {
    let paginationMock: { limit: number; page: number };

    beforeEach(() => {
      paginationMock = SHOPLIST_MOCK.SERVICE.pagination;
    });
    it('should findAll shoplists', async () => {
      const result = await shoplistController.findAll(paginationMock);
      expect(result).toEqual(undefined);
      expect(mockShoplistService.findAll).toHaveBeenCalledWith(paginationMock);
    });

    it('should throw an error if findAll fails', async () => {
      mockShoplistService.findAll.mockRejectedValue(new Error('Error'));
      await expect(shoplistController.findAll(paginationMock)).rejects.toThrow(
        'Error',
      );
    });
  });
});
