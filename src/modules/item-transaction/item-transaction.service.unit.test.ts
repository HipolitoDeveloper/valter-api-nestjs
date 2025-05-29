import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ITEM_STATE, PORTION_TYPE } from '../shoplist/shoplist.enum';
import { ItemTransactionRepository } from './item-transaction.repository';
import { ItemTransactionService } from './item-transaction.service';
import { Prisma } from '.prisma/client';

jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('ItemTransactionService', () => {
  let itemTransactionService: ItemTransactionService;
  let itemTransactionRepository: jest.Mocked<ItemTransactionRepository>;

  beforeEach(async () => {
    (uuidv4 as jest.Mock).mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemTransactionService,
        {
          provide: ItemTransactionRepository,
          useValue: {
            getTransactionCode: jest.fn(),
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    itemTransactionService = module.get<ItemTransactionService>(
      ItemTransactionService,
    );
    itemTransactionRepository = module.get(ItemTransactionRepository);
    jest.resetAllMocks();
  });

  describe('generateTransactionCode', () => {
    const productId = 'prod1';
    const userId = 'user1';

    it('should return new uuid when no existing transaction', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('new-uuid');
      itemTransactionRepository.getTransactionCode.mockResolvedValue(null);

      const code = await itemTransactionService.generateTransactionCode(
        productId,
        userId,
        ITEM_STATE.IN_CART,
      );
      expect(itemTransactionRepository.getTransactionCode).toHaveBeenCalledWith(
        productId,
        userId,
      );
      expect(code).toBe('new-uuid');
    });

    it('should return existing code when state matches', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('ignored-uuid');
      itemTransactionRepository.getTransactionCode.mockResolvedValue({
        transaction_code: 'existing-code',
        state: ITEM_STATE.IN_CART,
      } as any);

      const code = await itemTransactionService.generateTransactionCode(
        productId,
        userId,
        ITEM_STATE.IN_CART,
      );
      expect(code).toBe('existing-code');
    });

    it('should return new uuid when state differs', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('new-uuid');
      itemTransactionRepository.getTransactionCode.mockResolvedValue({
        transaction_code: 'existing-code',
        state: ITEM_STATE.IN_PANTRY,
      } as any);

      const code = await itemTransactionService.generateTransactionCode(
        productId,
        userId,
        ITEM_STATE.IN_CART,
      );
      expect(code).toBe('new-uuid');
    });

    it('should throw ErrorException on itemTransactionRepository error', async () => {
      itemTransactionRepository.getTransactionCode.mockRejectedValue(
        new Error('fail'),
      );

      await expect(
        itemTransactionService.generateTransactionCode(
          productId,
          userId,
          ITEM_STATE.IN_CART,
        ),
      ).rejects.toThrow(new ErrorException(ERRORS.DATABASE_ERROR));
    });
  });

  describe('getTransactionCode', () => {
    const productId = 'prod2';
    const userId = 'user2';

    it('should return existing code when present', async () => {
      itemTransactionRepository.getTransactionCode.mockResolvedValue({
        transaction_code: 'exist',
      } as any);
      const code = await itemTransactionService.getTransactionCode(
        productId,
        userId,
      );
      expect(code).toBe('exist');
    });

    it('should return new uuid when none present', async () => {
      (uuidv4 as jest.Mock).mockReturnValue('new-uuid');
      itemTransactionRepository.getTransactionCode.mockResolvedValue(null);

      const code = await itemTransactionService.getTransactionCode(
        productId,
        userId,
      );
      expect(code).toBe('new-uuid');
    });

    it('should throw ErrorException on itemTransactionRepository error', async () => {
      itemTransactionRepository.getTransactionCode.mockRejectedValue(
        new Error('fail'),
      );

      await expect(
        itemTransactionService.getTransactionCode(productId, userId),
      ).rejects.toThrow(new ErrorException(ERRORS.DATABASE_ERROR));
    });
  });

  describe('create', () => {
    const userId = 'user1';
    const prismaTx = {} as Prisma.TransactionClient;
    const items = [
      {
        productId: 'p1',
        portion: 2,
        portionType: PORTION_TYPE.GRAMS,
        state: ITEM_STATE.IN_CART,
        validUntil: '2025-06-01T00:00:00Z',
      },
      {
        productId: 'p2',
        portion: 3,
        portionType: PORTION_TYPE.GRAMS,
        state: ITEM_STATE.IN_PANTRY,
        validUntil: '2025-06-02T00:00:00Z',
      },
      {
        productId: 'p3',
        portion: 1,
        portionType: PORTION_TYPE.GRAMS,
        state: ITEM_STATE.PURCHASED,
        validUntil: '2025-06-03T00:00:00Z',
      },
      {
        productId: 'p4',
        portion: 4,
        portionType: PORTION_TYPE.GRAMS,
        state: ITEM_STATE.REMOVED,
        validUntil: '2025-06-04T00:00:00Z',
      },
    ];

    it('should call itemTransactionRepository.createMany with mapped items', async () => {
      jest
        .spyOn(itemTransactionService, 'generateTransactionCode')
        .mockResolvedValue('gen-code');
      jest
        .spyOn(itemTransactionService, 'getTransactionCode')
        .mockResolvedValue('mov-code');

      const result = await itemTransactionService.create(
        { items, userId },
        prismaTx,
      );

      expect(
        itemTransactionService.generateTransactionCode,
      ).toHaveBeenCalledTimes(2);
      expect(
        itemTransactionService.generateTransactionCode,
      ).toHaveBeenNthCalledWith(1, 'p1', userId, ITEM_STATE.IN_CART);
      expect(
        itemTransactionService.generateTransactionCode,
      ).toHaveBeenNthCalledWith(2, 'p2', userId, ITEM_STATE.IN_PANTRY);

      expect(itemTransactionService.getTransactionCode).toHaveBeenCalledTimes(
        2,
      );
      expect(itemTransactionService.getTransactionCode).toHaveBeenNthCalledWith(
        1,
        'p3',
        userId,
      );
      expect(itemTransactionService.getTransactionCode).toHaveBeenNthCalledWith(
        2,
        'p4',
        userId,
      );

      expect(itemTransactionRepository.createMany).toHaveBeenCalledWith(
        [
          {
            product_id: 'p1',
            portion: 2,
            portion_type: PORTION_TYPE.GRAMS,
            state: ITEM_STATE.IN_CART,
            valid_until: '2025-06-01T00:00:00Z',
            user_id: userId,
            transaction_code: 'gen-code',
          },
          {
            product_id: 'p2',
            portion: 3,
            portion_type: PORTION_TYPE.GRAMS,
            state: ITEM_STATE.IN_PANTRY,
            valid_until: '2025-06-02T00:00:00Z',
            user_id: userId,
            transaction_code: 'gen-code',
          },
          {
            product_id: 'p3',
            portion: 1,
            portion_type: PORTION_TYPE.GRAMS,
            state: ITEM_STATE.PURCHASED,
            valid_until: '2025-06-03T00:00:00Z',
            user_id: userId,
            transaction_code: 'mov-code',
          },
          {
            product_id: 'p4',
            portion: 4,
            portion_type: PORTION_TYPE.GRAMS,
            state: ITEM_STATE.REMOVED,
            valid_until: '2025-06-04T00:00:00Z',
            user_id: userId,
            transaction_code: 'mov-code',
          },
        ],
        prismaTx,
      );
    });

    it('should propagate itemTransactionRepository errors', async () => {
      jest
        .spyOn(itemTransactionService, 'generateTransactionCode')
        .mockResolvedValue('gen-code');
      jest
        .spyOn(itemTransactionService, 'getTransactionCode')
        .mockResolvedValue('mov-code');
      itemTransactionRepository.createMany.mockRejectedValue(new Error('fail'));

      await expect(
        itemTransactionService.create({ items, userId }, prismaTx),
      ).rejects.toThrow(new Error('fail'));
    });
  });
});
