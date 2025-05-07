import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ShoplistRepository } from './shoplist.repository';
import { ShoplistService } from './shoplist.service';

describe('ShoplistService', () => {
  let shoplistService: ShoplistService;
  let shoplistRepository: ShoplistRepository;

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
          },
        },
      ],
    }).compile();

    shoplistService = module.get<ShoplistService>(ShoplistService);
    shoplistRepository = module.get<ShoplistRepository>(ShoplistRepository);
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
          }
        }
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
    let shoplistUpdateMock;
    let updatedShoplistMock;

    beforeEach(() => {
      shoplistUpdateMock = mocks.SHOPLIST_MOCK.SERVICE.updateShoplistBody;
      updatedShoplistMock = mocks.SHOPLIST_MOCK.REPOSITORY.update;
    });
    it('should update a shoplist and return data updated', async () => {
      jest
        .spyOn(shoplistRepository, 'update')
        .mockResolvedValue(updatedShoplistMock);

      const result = await shoplistService.update(shoplistUpdateMock);

      expect(shoplistRepository.update).toHaveBeenCalledWith({
        id: shoplistUpdateMock.id,
        name: shoplistUpdateMock.name,
      });
      expect(result).toEqual({
        id: updatedShoplistMock.id,
        name: updatedShoplistMock.name,
      });
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(shoplistRepository, 'update').mockRejectedValue(new Error());

      await expect(shoplistService.update(shoplistUpdateMock)).rejects.toThrow(
        new ErrorException(ERRORS.UPDATE_ENTITY_ERROR),
      );
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
});
