import { Test, TestingModule } from '@nestjs/testing';
import { PANTRY_MOCK } from '../../../test/mocks/pantry.mock';
import { USER_MOCK } from '../../../test/mocks/user.mock';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { Request } from '../../common/types/http.type';
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';
import { PantryControllerNamespace } from './pantry.type';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;

describe('PantryController', () => {
  let pantryController: PantryController;

  const mockPantryService = {
    create: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PantryController],
      providers: [
        {
          provide: PantryService,
          useValue: mockPantryService,
        },
        ExceptionHandler,
      ],
    }).compile();

    pantryController = module.get<PantryController>(PantryController);
  });

  describe('create', () => {
    let createPantryBody: CreatePantryBody;

    beforeEach(() => {
      createPantryBody = PANTRY_MOCK.SERVICE.createPantryBody;
    });

    it('should create a pantry', async () => {
      const result = await pantryController.create(createPantryBody);
      expect(result).toEqual(undefined);
      expect(mockPantryService.create).toHaveBeenCalledWith(createPantryBody);
    });

    it('should throw an error if pantry creation fails', async () => {
      mockPantryService.create.mockRejectedValue(new Error('Error'));
      await expect(pantryController.create(createPantryBody)).rejects.toThrow(
        'Error',
      );
    });
  });

  describe('update', () => {
    let updatePantryBody: CreatePantryBody;
    let currentUser;

    beforeEach(() => {
      updatePantryBody = PANTRY_MOCK.SERVICE.updatePantryBody;
      currentUser = USER_MOCK.currentUser;
    });
    it('should update a pantry', async () => {
      const result = await pantryController.update(updatePantryBody, {
        currentUser: currentUser,
      } as Request);
      expect(result).toEqual(undefined);
      expect(mockPantryService.update).toHaveBeenCalledWith(
        updatePantryBody,
        currentUser.pantryId,
      );
    });

    it('should throw an error if pantry creation fails', async () => {
      mockPantryService.update.mockRejectedValue(new Error('Error'));
      await expect(
        pantryController.update(updatePantryBody, {
          currentUser: currentUser,
        } as Request),
      ).rejects.toThrow('Error');
    });
  });

  describe('findOne', () => {
    let pantryIdMock: string;

    beforeEach(() => {
      pantryIdMock = PANTRY_MOCK.SERVICE.pantryId;
    });
    it('should finddOne pantry', async () => {
      const result = await pantryController.findOne({ id: pantryIdMock });
      expect(result).toEqual(undefined);
      expect(mockPantryService.findOne).toHaveBeenCalledWith(pantryIdMock);
    });

    it('should throw an error if pantry creation fails', async () => {
      mockPantryService.findOne.mockRejectedValue(new Error('Error'));
      await expect(
        pantryController.findOne({ id: pantryIdMock }),
      ).rejects.toThrow('Error');
    });
  });

  describe('findAll', () => {
    let paginationMock: { limit: number; page: number };

    beforeEach(() => {
      paginationMock = PANTRY_MOCK.SERVICE.pagination;
    });
    it('should findAll pantries', async () => {
      const result = await pantryController.findAll(paginationMock);
      expect(result).toEqual(undefined);
      expect(mockPantryService.findAll).toHaveBeenCalledWith(paginationMock);
    });

    it('should throw an error if findAll fails', async () => {
      mockPantryService.findAll.mockRejectedValue(new Error('Error'));
      await expect(pantryController.findAll(paginationMock)).rejects.toThrow(
        'Error',
      );
    });
  });
});
