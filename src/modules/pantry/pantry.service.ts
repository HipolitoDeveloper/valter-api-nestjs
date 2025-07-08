import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/extension';
import prisma from '../../../prisma/prisma';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ItemTransactionService } from '../item-transaction/item-transaction.service';
import { ITEM_STATE } from '../shoplist/shoplist.enum';
import { ShoplistService } from '../shoplist/shoplist.service';
import { PantryRepository } from './pantry.repository';
import {
  PantryControllerNamespace,
  PantryRepositoryNamespace,
  PantryServiceNamespace,
} from './pantry.type';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;
import Pantry = PantryRepositoryNamespace.Pantry;
import UpdatePantryBody = PantryControllerNamespace.UpdatePantryBody;
import FindAllQuery = PantryControllerNamespace.FindAllQuery;
import addItemsToShoplistParam = PantryControllerNamespace.addItemsToShoplistParam;
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class PantryService {
  constructor(
    private pantryRepository: PantryRepository,
    @Inject(forwardRef(() => ShoplistService))
    private shoplistService: ShoplistService,
    private readonly itemTransactionService: ItemTransactionService,
  ) {}

  async create(
    pantry: CreatePantryBody,
  ): Promise<PantryServiceNamespace.CreateResponse> {
    let createdPantry: Pantry;
    try {
      createdPantry = await this.pantryRepository.create({
        name: pantry.name,
      });
    } catch {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR);
    }

    try {
      await this.shoplistService.create({
        name: createdPantry.name,
        pantryId: createdPantry.id,
      });
    } catch {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR);
    }

    return {
      id: createdPantry.id,
      name: createdPantry.name,
    };
  }

  async addItemsToShoplist(
    { items, pantryId }: addItemsToShoplistParam,
    prismaTransaction: TransactionClient,
    userId: string,
  ) {
    try {
      await this.shoplistService.update(
        {
          items: items,
        },
        pantryId,
        prismaTransaction,
        userId,
      );
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }
  }

  async update(
    { items, name }: UpdatePantryBody,
    id: string,
    prismaTransaction?: TransactionClient,
    userId?: string,
  ): Promise<PantryServiceNamespace.UpdateResponse> {
    let updatedPantry: Pantry;

    const inPantryItems = items.filter(
      (item) =>
        item.state === ITEM_STATE.IN_PANTRY ||
        item.state === ITEM_STATE.PURCHASED,
    );

    const inCartItems = items.filter(
      (item) => item.state === ITEM_STATE.IN_CART,
    );

    const removedItems = [
      ...items.filter((item) => item.state === ITEM_STATE.REMOVED),
      ...inCartItems,
    ].map((item) => item.id);

    try {
      await prisma.$transaction(async (prisma) => {
        updatedPantry = await this.pantryRepository.update(
          {
            id,
            inPantryItems,
            removedItems,
            name,
          },
          prismaTransaction || prisma,
        );

        if (inCartItems.length > 0) {
          await this.addItemsToShoplist(
            { items: inCartItems, pantryId: id },
            prismaTransaction || prisma,
            userId,
          );
        }

        await this.itemTransactionService.create(
          { items, userId },
          prismaTransaction || prisma,
        );
      });
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }

    return {
      id: updatedPantry.id,
      name: updatedPantry.name,
      items: updatedPantry.pantry_items.map((pantryItem) => {
        return {
          id: pantryItem.id,
          name: pantryItem.product.name,
          portion: pantryItem.portion,
          portionType: pantryItem.portion_type,
          productId: pantryItem.product.id,
          state: ITEM_STATE.IN_PANTRY,
          validUntil: pantryItem.valid_until,
        };
      }),
    };
  }

  async findOne(
    pantryId: string,
  ): Promise<PantryServiceNamespace.FindOneResponse> {
    let pantry: Pantry;
    try {
      pantry = await this.pantryRepository.findOne(pantryId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!pantry) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      id: pantry.id,
      name: pantry.name,
      items: pantry.pantry_items.map((pantryItem) => {
        return {
          id: pantryItem.id,
          name: pantryItem.product.name,
          portion: pantryItem.portion,
          portionType: pantryItem.portion_type,
          productId: pantryItem.product.id,
          state: ITEM_STATE.IN_PANTRY,
          validUntil: pantryItem.valid_until,
        };
      }),
    };
  }

  async findAll({
    limit,
    page,
  }: FindAllQuery): Promise<PantryServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    let pantries: { data: Pantry[]; totalCount: number };
    try {
      pantries = await this.pantryRepository.findAll({ limit, offset });
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return {
      data: pantries.data.map((pantry) => ({
        id: pantry.id,
        name: pantry.name,
      })),
      totalCount: pantries.totalCount,
    };
  }
}
