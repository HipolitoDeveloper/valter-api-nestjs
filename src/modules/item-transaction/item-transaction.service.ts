import { Injectable } from '@nestjs/common';
import { ItemState } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ITEM_STATE } from '../shoplist/shoplist.enum';
import { ItemTransactionRepository } from './item-transaction.repository';
import { ItemTransactionServiceNamespace } from './item-transaction.type';
import { Prisma } from '.prisma/client';
import CreateResponse = ItemTransactionServiceNamespace.CreateResponse;
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class ItemTransactionService {
  constructor(private itemTransactionRepository: ItemTransactionRepository) {}

  async generateTransactionCode(
    productId: string,
    userId: string,
    currentItemState: ItemState,
  ) {
    let itemTransactionData;
    let transactionCode = uuidv4();
    try {
      itemTransactionData =
        await this.itemTransactionRepository.getTransactionCode(
          productId,
          userId,
        );
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (itemTransactionData && itemTransactionData.state === currentItemState) {
      transactionCode = itemTransactionData.transaction_code;
    }

    return transactionCode;
  }

  async getTransactionCode(productId: string, userId: string) {
    let itemTransactionData;
    let transactionCode = uuidv4();
    try {
      itemTransactionData =
        await this.itemTransactionRepository.getTransactionCode(
          productId,
          userId,
        );
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (itemTransactionData) {
      transactionCode = itemTransactionData.transaction_code;
    }

    return transactionCode;
  }

  async create(
    { items, userId }: CreateResponse,
    prismaTransaction: TransactionClient,
  ) {
    const inListItemsPromises = items
      .filter(
        (item) =>
          item.state === ITEM_STATE.IN_CART ||
          item.state === ITEM_STATE.IN_PANTRY ||
          item.state === ITEM_STATE.UPDATED,
      )
      .map(async (item) => ({
        ...item,
        transactionCode: await this.generateTransactionCode(
          item.productId,
          userId,
          item.state,
        ),
      }));

    const inListItems = await Promise.all(inListItemsPromises);

    const movingItemsPromises = items
      .filter(
        (item) =>
          item.state === ITEM_STATE.PURCHASED ||
          item.state === ITEM_STATE.REMOVED,
      )
      .map(async (item) => ({
        ...item,
        transactionCode: await this.getTransactionCode(item.productId, userId),
      }));

    const movingItems = await Promise.all(movingItemsPromises);

    await this.itemTransactionRepository.createMany(
      [...inListItems, ...movingItems].map((item) => ({
        product_id: item.productId,
        portion: item.portion,
        portion_type: item.portionType,
        state: item.state,
        valid_until: item.validUntil,
        user_id: userId,
        transaction_code: item.transactionCode,
      })),
      prismaTransaction,
    );
  }
}
