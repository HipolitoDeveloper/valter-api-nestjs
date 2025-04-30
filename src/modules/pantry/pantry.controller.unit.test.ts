import { Test, TestingModule } from '@nestjs/testing';
import { PANTRY_MOCK } from '../../../test/mocks/pantry.mock';
import { ExceptionHandler } from '../../common/handler/exception.handler';
import { PantryController } from './pantry.controller';
import { PantryService } from './pantry.service';
import { PantryControllerNamespace } from './pantry.type';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;

describe('PantryController', () => {
  let pantryController: PantryController;

  const mockPantryService = {
    create: jest.fn(),
  };

  let createPantryBody: CreatePantryBody;
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

    createPantryBody = PANTRY_MOCK.SERVICE.createPantryBody;
  });

  describe('create', () => {
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
});
