import { Test, TestingModule } from '@nestjs/testing';
import prisma from '../../../prisma/prisma';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ItemTransactionService } from '../item-transaction/item-transaction.service';
import { ITEM_STATE } from '../shoplist/shoplist.enum';
import { ShoplistService } from '../shoplist/shoplist.service';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';
import { Prisma } from '.prisma/client';

describe('PantryService', () => {
  let pantryService: PantryService;
  let pantryRepository: PantryRepository;

  let shoplistService: ShoplistService;
  let itemTransactionService: ItemTransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PantryService,
        {
          provide: PantryRepository,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn(),
            findAll: jest.fn(),
          },
        },
        {
          provide: ShoplistService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ItemTransactionService,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    pantryService = module.get<PantryService>(PantryService);
    pantryRepository = module.get<PantryRepository>(PantryRepository);

    shoplistService = module.get<ShoplistService>(ShoplistService);
    itemTransactionService = module.get<ItemTransactionService>(
      ItemTransactionService,
    );
    jest.resetAllMocks();
  });

  describe('create', () => {
    let pantryCreateMock;
    let createdPantryMock;
    let shoplistCreateMock;

    beforeEach(() => {
      pantryCreateMock = mocks.PANTRY_MOCK.SERVICE.createPantryBody;
      createdPantryMock = mocks.PANTRY_MOCK.REPOSITORY.create;
      shoplistCreateMock = mocks.SHOPLIST_MOCK.SERVICE.createShoplistBody;
    });
    it('should create a pantry and return the creation', async () => {
      jest
        .spyOn(pantryRepository, 'create')
        .mockResolvedValue(createdPantryMock);

      jest.spyOn(shoplistService, 'create').mockResolvedValue(null);

      const result = await pantryService.create(pantryCreateMock);

      expect(pantryRepository.create).toHaveBeenCalledWith({
        name: pantryCreateMock.name,
      });

      expect(shoplistService.create).toHaveBeenCalledWith({
        pantryId: createdPantryMock.id,
        name: createdPantryMock.name,
      });

      expect(result).toEqual({
        id: createdPantryMock.id,
        name: createdPantryMock.name,
      });
    });
    it('should throw ErrorException "CREATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(pantryRepository, 'create').mockRejectedValue(new Error());

      await expect(pantryService.create(pantryCreateMock)).rejects.toThrow(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });

    it('should throw ErrorException "CREATE_ENTITY_ERROR" if shoplist creation doesnt work', async () => {
      jest.spyOn(shoplistService, 'create').mockRejectedValue(new Error());

      await expect(pantryService.create(shoplistCreateMock)).rejects.toThrow(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });
  });

  describe('update', () => {
    let pantryUpdateMock;
    let updatedPantryMock;
    let updatePantryResponseMock;
    let pantryIdMock;
    let updatePantryBodyWithInCartMock;

    beforeEach(() => {
      pantryUpdateMock = mocks.PANTRY_MOCK.SERVICE.updatePantryBody;
      updatedPantryMock = mocks.PANTRY_MOCK.REPOSITORY.update;
      updatePantryResponseMock = mocks.PANTRY_MOCK.SERVICE.updatePantryResponse;
      pantryIdMock = mocks.PANTRY_MOCK.SERVICE.pantryId;
      updatePantryBodyWithInCartMock =
        mocks.PANTRY_MOCK.SERVICE.updatePantryBodyWithInCartMock;
      jest.resetAllMocks();
    });

    describe('Without parameter transaction', () => {
      it('should update a pantry and return data updated ', async () => {
        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(prisma));

        jest
          .spyOn(pantryRepository, 'update')
          .mockResolvedValue(updatedPantryMock);

        const result = await pantryService.update(
          pantryUpdateMock,
          pantryIdMock,
        );

        expect(prisma.$transaction).toHaveBeenCalledTimes(1);

        expect(pantryRepository.update).toHaveBeenCalledWith(
          {
            id: pantryUpdateMock.id,
            name: pantryUpdateMock.name,
            inPantryItems: pantryUpdateMock.items,
            removedItems: [],
          },
          prisma,
        );

        expect(itemTransactionService.create).toHaveBeenCalledWith(
          {
            items: pantryUpdateMock.items,
            userId: undefined,
          },
          prisma,
        );
        expect(result).toEqual({
          id: updatePantryResponseMock.id,
          name: updatePantryResponseMock.name,
          items: updatePantryResponseMock.items,
        });
      });

      it('should update a shoplist that has IN_CART items and return data updated', async () => {
        const mockInnerTransaction = {
          __source: 'inner',
        } as unknown as Prisma.TransactionClient;
        jest
          .spyOn(prisma, '$transaction')
          .mockImplementation(async (fn) => fn(mockInnerTransaction));

        jest
          .spyOn(pantryRepository, 'update')
          .mockResolvedValue(updatedPantryMock);
        jest.spyOn(shoplistService, 'update').mockResolvedValue(null);

        const result = await pantryService.update(
          updatePantryBodyWithInCartMock,
          pantryIdMock,
        );

        expect(shoplistService.update).toHaveBeenCalledWith(
          {
            items: updatePantryBodyWithInCartMock.items.filter(
              (item) => item.state === ITEM_STATE.IN_CART,
            ),
          },
          pantryIdMock,
          mockInnerTransaction,
        );

        expect(pantryRepository.update).toHaveBeenCalledWith(
          {
            inPantryItems: updatePantryBodyWithInCartMock.items.filter(
              (item) => item.state === ITEM_STATE.IN_PANTRY,
            ),
            removedItems: updatePantryBodyWithInCartMock.items
              .filter((item) => item.state === ITEM_STATE.IN_CART)
              .map((item) => item.id),
            id: pantryIdMock,
          },
          mockInnerTransaction,
        );

        expect(itemTransactionService.create).toHaveBeenCalledWith(
          {
            items: updatePantryBodyWithInCartMock.items,
            userId: undefined,
          },
          mockInnerTransaction,
        );
        expect(result).toEqual({
          id: updatePantryResponseMock.id,
          name: updatePantryResponseMock.name,
          items: updatePantryResponseMock.items,
        });
      });
    });

    describe('With parameter transaction', () => {
      it('should update a pantry and return data updated with no external transaction', async () => {
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
          .spyOn(pantryRepository, 'update')
          .mockResolvedValue(updatedPantryMock);

        const result = await pantryService.update(
          pantryUpdateMock,
          pantryIdMock,
          mockParameterTransaction,
        );

        expect(prisma.$transaction).toHaveBeenCalledTimes(1);
        expect(pantryRepository.update).toHaveBeenCalledWith(
          {
            id: pantryUpdateMock.id,
            name: pantryUpdateMock.name,
            inPantryItems: pantryUpdateMock.items,
            removedItems: [],
          },
          mockParameterTransaction,
        );

        expect(itemTransactionService.create).toHaveBeenCalledWith(
          {
            items: pantryUpdateMock.items,
            userId: undefined,
          },
          mockParameterTransaction,
        );
        expect(result).toEqual({
          id: updatePantryResponseMock.id,
          name: updatePantryResponseMock.name,
          items: updatePantryResponseMock.items,
        });
      });
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if add items to shoplist fails', async () => {
      const mockInnerTransaction = {
        __source: 'inner',
      } as unknown as Prisma.TransactionClient;
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (fn) => fn(mockInnerTransaction));

      jest
        .spyOn(pantryRepository, 'update')
        .mockResolvedValue(updatedPantryMock);
      jest.spyOn(shoplistService, 'update').mockRejectedValue(new Error());

      await expect(
        pantryService.update(updatePantryBodyWithInCartMock, pantryIdMock),
      ).rejects.toThrow(new ErrorException(ERRORS.UPDATE_ENTITY_ERROR));
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if creation doesnt work', async () => {
      const mockInnerTransaction = {
        __source: 'inner',
      } as unknown as Prisma.TransactionClient;
      jest
        .spyOn(prisma, '$transaction')
        .mockImplementation(async (fn) => fn(mockInnerTransaction));
      jest.spyOn(pantryRepository, 'update').mockRejectedValue(new Error());

      await expect(
        pantryService.update(pantryUpdateMock, pantryIdMock),
      ).rejects.toThrow(new ErrorException(ERRORS.UPDATE_ENTITY_ERROR));
    });
  });

  describe('findOne', () => {
    let pantryIdMock;
    let pantryMock;

    beforeEach(() => {
      pantryIdMock = mocks.PANTRY_MOCK.SERVICE.pantryId;
      pantryMock = mocks.PANTRY_MOCK.REPOSITORY.findOne;
    });
    it('should findOne pantry', async () => {
      jest.spyOn(pantryRepository, 'findOne').mockResolvedValue(pantryMock);

      const result = await pantryService.findOne(pantryIdMock);

      expect(pantryRepository.findOne).toHaveBeenCalledWith(pantryIdMock);
      expect(result).toEqual({
        id: pantryMock.id,
        name: pantryMock.name,
        items: pantryMock.pantry_items.map((item) => ({
          id: item.id,
          name: item.product.name,
          portion: item.portion,
          portionType: item.portion_type,
          productId: item.product.id,
          state: ITEM_STATE.IN_PANTRY,
          validUntil: item.valid_until,
        })),
      });
    });

    it('should throw ErrorException "DATAVASE_ERROR" if findOne fails', async () => {
      jest.spyOn(pantryRepository, 'findOne').mockRejectedValue(new Error());

      await expect(pantryService.findOne(pantryIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });

    it('should throw ErrorException "NOT_FOUND_ENTITY" if any pantry was found', async () => {
      jest.spyOn(pantryRepository, 'findOne').mockResolvedValue(undefined);

      await expect(pantryService.findOne(pantryIdMock)).rejects.toThrow(
        new ErrorException(ERRORS.NOT_FOUND_ENTITY),
      );
    });
  });

  describe('findAll', () => {
    let pantriesMock;
    let paginationMock;
    let findAllPantriesMock;

    beforeEach(() => {
      paginationMock = mocks.PANTRY_MOCK.SERVICE.pagination;
      pantriesMock = mocks.PANTRY_MOCK.SERVICE.findAllResponse;
      findAllPantriesMock = mocks.PANTRY_MOCK.REPOSITORY.findAll;
    });
    it('should findAll pantries', async () => {
      jest
        .spyOn(pantryRepository, 'findAll')
        .mockResolvedValue(findAllPantriesMock);

      const result = await pantryService.findAll(paginationMock);

      expect(pantryRepository.findAll).toHaveBeenCalledWith({
        limit: paginationMock.limit,
        offset: 0,
      });
      expect(result).toEqual(pantriesMock);
    });

    it('should throw ErrorException "DATABASE_ERROR" if findAll fails', async () => {
      jest.spyOn(pantryRepository, 'findAll').mockRejectedValue(new Error());

      await expect(pantryService.findAll(paginationMock)).rejects.toThrow(
        new ErrorException(ERRORS.DATABASE_ERROR),
      );
    });
  });
});
