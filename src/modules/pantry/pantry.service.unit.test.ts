import { Test, TestingModule } from '@nestjs/testing';
import mocks from '../../../test/mocks';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';

describe('PantryService', () => {
  let pantryService: PantryService;
  let pantryRepository: PantryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PantryService,
        {
          provide: PantryRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    pantryService = module.get<PantryService>(PantryService);
    pantryRepository = module.get<PantryRepository>(PantryRepository);
  });

  describe('create', () => {
    let pantryCreateMock;

    beforeEach(() => {
      pantryCreateMock = mocks.PANTRY_MOCK.SERVICE.createPantryBody;
    });
    it('should create a pantry and return the creation', async () => {
      jest
        .spyOn(pantryRepository, 'create')
        .mockResolvedValue(pantryCreateMock);

      const result = await pantryService.create(pantryCreateMock);

      expect(pantryRepository.create).toHaveBeenCalledWith({
        name: pantryCreateMock.name,
      });
      expect(result).toEqual({
        name: pantryCreateMock.name,
      });
    });

    it('should throw ErrorException "CREATE_ENTITY_ERROR" if creation doesnt work', async () => {
      jest.spyOn(pantryRepository, 'create').mockRejectedValue(new Error());

      await expect(pantryService.create(pantryCreateMock)).rejects.toThrow(
        new ErrorException(ERRORS.CREATE_ENTITY_ERROR),
      );
    });
  });
});
