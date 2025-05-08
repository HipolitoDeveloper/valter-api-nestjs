import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ShoplistService } from '../shoplist/shoplist.service';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';

describe('PantryService', () => {
  let pantryService: PantryService;
  let pantryRepository: PantryRepository;

  let shoplistService: ShoplistService;

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
          },
        },
      ],
    }).compile();

    pantryService = module.get<PantryService>(PantryService);
    pantryRepository = module.get<PantryRepository>(PantryRepository);

    shoplistService = module.get<ShoplistService>(ShoplistService);
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

    beforeEach(() => {
      pantryUpdateMock = mocks.PANTRY_MOCK.SERVICE.updatePantryBody;
      updatedPantryMock = mocks.PANTRY_MOCK.REPOSITORY.update;
    });
    it('should update a pantry and return data updated', async () => {
      jest
        .spyOn(pantryRepository, 'update')
        .mockResolvedValue(updatedPantryMock);

      const result = await pantryService.update(pantryUpdateMock);

      expect(pantryRepository.update).toHaveBeenCalledWith({
        id: pantryUpdateMock.id,
        name: pantryUpdateMock.name,
      });
      expect(result).toEqual({
        id: updatedPantryMock.id,
        name: updatedPantryMock.name,
      });
    });

    it('should throw ErrorException "UPDATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(pantryRepository, 'update').mockRejectedValue(new Error());

      await expect(pantryService.update(pantryUpdateMock)).rejects.toThrow(
        new ErrorException(ERRORS.UPDATE_ENTITY_ERROR),
      );
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
