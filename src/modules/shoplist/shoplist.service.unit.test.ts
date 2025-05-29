import { Test, TestingModule } from '@nestjs/testing';
import prisma from '../../../prisma/prisma';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { PantryService } from '../pantry/pantry.service';
import { ITEM_STATE } from './shoplist.enum';
import { ShoplistRepository } from './shoplist.repository';
import { ShoplistService } from './shoplist.service';
import { Prisma } from '.prisma/client';

describe('ShoplistService', () => {
  let shoplistService: ShoplistService;
  let shoplistRepository: ShoplistRepository;
  let pantryService: PantryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShoplistService,
        {
          provide: ShoplistRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
            findOneByPantryId: jest.fn(),
          },
        },
        {
          provide: PantryService,
          useValue: {
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    shoplistService = module.get<ShoplistService>(ShoplistService);
    shoplistRepository = module.get<ShoplistRepository>(ShoplistRepository);
    pantryService = module.get<PantryService>(PantryService);
  });

  describe('create', () => {
    let shoplistCreateMock;
    let createdShoplistMock;

    beforeEach(() => {
      shoplistCreateMock = mocks.SHOPLIST_MOCK.SERVICE.createShoplistBody;
      createdShoplistMock = mocks.SHOPLIST_MOCK.REPOSITORY.create;
    });
    it('should create a shoplist and return the creation', async () => {
      jest
        .spyOn(shoplistRepository, 'create')
        .mockResolvedValue(createdShoplistMock);

      const result = await shoplistService.create(shoplistCreateMock);

      expect(shoplistRepository.create).toHaveBeenCalledWith({
        name: shoplistCreateMock.name,
        pantry: {
          connect: {
            id: shoplistCreateMock.pantryId,
          },
        },
      });
      expect(result).toEqual({
        id: createdShoplistMock.id,
        name: createdShoplistMock.name,
      });
    });

    it('should throw ErrorException "CREATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(shoplistRepository, 'create').mockRejectedValue(new Error());

      await expect(shoplistService.create(shoplistCreateMock)).rejects.toThrow(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });
  });

  describe('update', () => {
    let updateShoplistBodyMock;
    let updateShoplistBodyWithInPantryMock: any;
    let updatedShoplistMock;
    let updateShoplistResponseMock;
    let pantryIdMock;
    let findOneByPantryIdMock;

    beforeEach(() => {
      updateShoplistBodyMock = mocks.SHOPLIST_MOCK.SERVICE.updateShoplistBody;
      updateShoplistBodyWithInPantryMock =
        mocks.SHOPLIST_MOCK.SERVICE.updateShoplistBodyWithInPantryMock;
      updatedShoplistMock = mocks.SHOPLIST_MOCK.REPOSITORY.update;
      findOneByPantryIdMock = mocks.SHOPLIST_MOCK.REPOSITORY.findOneByPantryId;
      updateShoplistResponseMock =
        mocks.SHOPLIST_MOCK.SERVICE.updateShoplistResponse;
      pantryIdMock = mocks.SHOPLIST_MOCK.SERVICE.pantryId;
      jest.resetAllMocks();
    });
    describe('Without parameter transaction', () => {
      it('should update a shoplist and return data updated', async () => {
        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(prisma));

        jest
          .spyOn(shoplistRepository, 'update')
          .mockResolvedValue(updatedShoplistMock);
        jest
          .spyOn(shoplistRepository, 'findOneByPantryId')
          .mockResolvedValue(findOneByPantryIdMock);

        const result = await shoplistService.update(
          updateShoplistBodyMock,
          pantryIdMock,
        );

        expect(shoplistRepository.findOneByPantryId).toHaveBeenCalledWith(
          pantryIdMock,
        );

        expect(shoplistRepository.update).toHaveBeenCalledWith(
          {
            shoplistId: findOneByPantryIdMock.id,
            name: updateShoplistBodyMock.name,
            inCartItems: updateShoplistBodyMock.items,
            removedItems: [],
          },
          prisma,
        );
        expect(result).toEqual({
          id: updateShoplistResponseMock.id,
          name: updateShoplistResponseMock.name,
          items: updateShoplistResponseMock.items,
        });
      });

      it('should update a shoplist that has IN_PANTRY items and return data updated', async () => {
        const mockInnerTransaction = {
          __source: 'inner',
        } as unknown as Prisma.TransactionClient;
        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(mockInnerTransaction));

        jest
          .spyOn(shoplistRepository, 'update')
          .mockResolvedValue(updatedShoplistMock);
        jest
          .spyOn(shoplistRepository, 'findOneByPantryId')
          .mockResolvedValue(findOneByPantryIdMock);

        jest.spyOn(pantryService, 'update').mockResolvedValue(undefined);

        const result = await shoplistService.update(
          updateShoplistBodyWithInPantryMock,
          pantryIdMock,
        );

        expect(shoplistRepository.update).toHaveBeenCalledWith(
          {
            shoplistId: updateShoplistBodyWithInPantryMock.id,
            inCartItems: updateShoplistBodyWithInPantryMock.items.filter(
              (item) => item.state === ITEM_STATE.IN_CART,
            ),
            removedItems: updateShoplistBodyWithInPantryMock.items
              .filter((item) => item.state === ITEM_STATE.PURCHASED)
              .map((item) => item.id),
          },
          mockInnerTransaction,
        );

        expect(pantryService.update).toHaveBeenCalledWith(
          {
            items: updateShoplistBodyWithInPantryMock.items.filter(
              (item) => item.state === ITEM_STATE.PURCHASED,
            ),
          },
          pantryIdMock,
          mockInnerTransaction,
        );
        expect(result).toEqual({
          id: updateShoplistResponseMock.id,
          name: updateShoplistResponseMock.name,
          items: updateShoplistResponseMock.items,
        });
      });
    });

    describe('With parameter transaction', () => {
      it('should update a shoplist and return data updated', async () => {
        const mockInnerTransaction = {
          __source: 'inner',
        } as unknown as Prisma.TransactionClient;
        const mockParameterTransaction = {
          __source: 'external',
        } as unknown as Prisma.TransactionClient;

        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(mockInnerTransaction));

        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(prisma));

        jest
          .spyOn(shoplistRepository, 'update')
          .mockResolvedValue(updatedShoplistMock);
        jest
          .spyOn(shoplistRepository, 'findOneByPantryId')
          .mockResolvedValue(findOneByPantryIdMock);

        const result = await shoplistService.update(
          updateShoplistBodyMock,
          pantryIdMock,
          mockParameterTransaction,
        );

        expect(shoplistRepository.findOneByPantryId).toHaveBeenCalledWith(
          pantryIdMock,
        );

        expect(shoplistRepository.update).toHaveBeenCalledWith(
          {
            shoplistId: findOneByPantryIdMock.id,
            name: updateShoplistBodyMock.name,
            inCartItems: updateShoplistBodyMock.items,
            removedItems: [],
          },
          mockParameterTransaction,
        );
        expect(result).toEqual({
          id: updateShoplistResponseMock.id,
          name: updateShoplistResponseMock.name,
          items: updateShoplistResponseMock.items,
        });
      });
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if add items to pantry fails', async () => {
      const mockInnerTransaction = {
        __source: 'inner',
      } as unknown as Prisma.TransactionClient;
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (fn) => fn(mockInnerTransaction));

      jest
        .spyOn(shoplistRepository, 'findOneByPantryId')
        .mockResolvedValue(findOneByPantryIdMock);
      jest.spyOn(pantryService, 'update').mockRejectedValue(new Error());

      await expect(
        shoplistService.update(
          updateShoplistBodyWithInPantryMock,
          pantryIdMock,
        ),
      ).rejects.toThrow(new ErrorException(ERRORS.UPDATE_ENTITY_ERROR));
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if creation doesnt work', async () => {
      const mockInnerTransaction = {
        __source: 'inner',
      } as unknown as Prisma.TransactionClient;
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (fn) => fn(mockInnerTransaction));

      jest.spyOn(shoplistRepository, 'update').mockRejectedValue(new Error());
      jest
        .spyOn(shoplistRepository, 'findOneByPantryId')
        .mockResolvedValue(findOneByPantryIdMock);
      await expect(
        shoplistService.update(updateShoplistBodyMock, pantryIdMock),
      ).rejects.toThrow(new ErrorException(ERRORS.UPDATE_ENTITY_ERROR));
    });
  });

  describe('findOne', () => {
    let shoplistIdMock;
    let shoplistMock;

    beforeEach(() => {
      shoplistIdMock = mocks.SHOPLIST_MOCK.SERVICE.shoplistId;
      shoplistMock = mocks.SHOPLIST_MOCK.REPOSITORY.findOne;
    });
    it('should findOne shoplist', async () => {
      jest.spyOn(shoplistRepository, 'findOne').mockResolvedValue(shoplistMock);

      const result = await shoplistService.findOne(shoplistIdMock);

      expect(shoplistRepository.findOne).toHaveBeenCalledWith(shoplistIdMock);
      expect(result).toEqual({
        id: shoplistMock.id,
        name: shoplistMock.name,
      });
    });

    it('should throw ErrorException "DATAVASE_ERROR" if findOne fails', async () => {
      jest.spyOn(shoplistRepository, 'findOne').mockRejectedValue(new Error());

      await expect(shoplistService.findOne(shoplistIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });

    it('should throw ErrorException "NOT_FOUND_ENTITY" if any shoplist was found', async () => {
      jest.spyOn(shoplistRepository, 'findOne').mockResolvedValue(undefined);

      await expect(shoplistService.findOne(shoplistIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.NOT_FOUND_ENTITY),
      );
    });
  });

  describe('findAll', () => {
    let shoplistsMock;
    let paginationMock;
    let findAllShoplistsMock;

    beforeEach(() => {
      paginationMock = mocks.SHOPLIST_MOCK.SERVICE.pagination;
      shoplistsMock = mocks.SHOPLIST_MOCK.SERVICE.findAllResponse;
      findAllShoplistsMock = mocks.SHOPLIST_MOCK.REPOSITORY.findAll;
    });
    it('should findAll shoplists', async () => {
      jest
        .spyOn(shoplistRepository, 'findAll')
        .mockResolvedValue(findAllShoplistsMock);

      const result = await shoplistService.findAll(paginationMock);

      expect(shoplistRepository.findAll).toHaveBeenCalledWith({
        limit: paginationMock.limit,
        offset: 0,
      });
      expect(result).toEqual(shoplistsMock);
    });

    it('should throw ErrorException "DATABASE_ERROR" if findAll fails', async () => {
      jest.spyOn(shoplistRepository, 'findAll').mockRejectedValue(new Error());

      await expect(shoplistService.findAll(paginationMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });

  describe('findOneByPantry', () => {
    let pantryIdMock;
    let shoplistMock;

    beforeEach(() => {
      pantryIdMock = mocks.SHOPLIST_MOCK.SERVICE.pantryId;
      shoplistMock = mocks.SHOPLIST_MOCK.REPOSITORY.findOneByPantryId;
    });
    it('should findOneByPantryId shoplist', async () => {
      jest
        .spyOn(shoplistRepository, 'findOneByPantryId')
        .mockResolvedValue(shoplistMock);

      const result = await shoplistService.findOneByPantryId(pantryIdMock);

      expect(shoplistRepository.findOneByPantryId).toHaveBeenCalledWith(
        pantryIdMock,
      );
      expect(result).toEqual({
        id: shoplistMock.id,
        name: shoplistMock.name,
      });
    });

    it('should throw ErrorException "DATABASE_ERROR" if findOne fails', async () => {
      jest
        .spyOn(shoplistRepository, 'findOneByPantryId')
        .mockRejectedValue(new Error());

      await expect(
        shoplistService.findOneByPantryId(pantryIdMock),
      ).rejects.toThrow(new ErrorException(ERRORS.DATABASE_ERROR));
    });

    it('should throw ErrorException "NOT_FOUND_ENTITY" if any shoplist was found', async () => {
      jest
        .spyOn(shoplistRepository, 'findOneByPantryId')
        .mockResolvedValue(undefined);

      await expect(shoplistService.findOne(pantryIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.NOT_FOUND_ENTITY),
      );
    });
  });
});
