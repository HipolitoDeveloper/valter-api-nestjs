import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client/extension';
import prisma from '../../../prisma/prisma';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ItemTransactionService } from '../item-transaction/item-transaction.service';
import { PantryService } from '../pantry/pantry.service';
import { ITEM_STATE } from './shoplist.enum';
import { ShoplistRepository } from './shoplist.repository';
import {
  ShoplistControllerNamespace,
  ShoplistRepositoryNamespace,
  ShoplistServiceNamespace,
} from './shoplist.type';
import Shoplist = ShoplistRepositoryNamespace.Shoplist;
import CreateShoplistBody = ShoplistControllerNamespace.CreateShoplistBody;
import FindAllQuery = ShoplistControllerNamespace.FindAllQuery;
import addItemsToPantryParam = ShoplistControllerNamespace.addItemsToPantryParam;
import UpdateShoplistBody = ShoplistControllerNamespace.UpdateShoplistBody;
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class ShoplistService {
  constructor(
    private shoplistRepository: ShoplistRepository,
    @Inject(forwardRef(() => PantryService))
    private readonly pantryService: PantryService,
    private readonly itemTransactionService: ItemTransactionService,
  ) {}

  async create(
    shoplist: CreateShoplistBody,
  ): Promise<ShoplistServiceNamespace.CreateResponse> {
    let createdShoplist: Shoplist;
    try {
      createdShoplist = await this.shoplistRepository.create({
        name: shoplist.name,
        pantry: {
          connect: {
            id: shoplist.pantryId,
          },
        },
      });
    } catch {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR);
    }

    return {
      id: createdShoplist.id,
      name: createdShoplist.name,
    };
  }

  async findOne(
    shoplistId: string,
  ): Promise<ShoplistServiceNamespace.FindOneResponse> {
    let shoplist: Shoplist;
    try {
      shoplist = await this.shoplistRepository.findOne(shoplistId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!shoplist) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      id: shoplist.id,
      name: shoplist.name,
    };
  }

  async findOneByPantryId(
    pantryId: string,
  ): Promise<ShoplistServiceNamespace.FindOneResponse> {
    let shoplist: Shoplist;
    try {
      shoplist = await this.shoplistRepository.findOneByPantryId(pantryId);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    if (!shoplist) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      id: shoplist.id,
      name: shoplist.name,
    };
  }

  async findAll({
    limit,
    page,
  }: FindAllQuery): Promise<ShoplistServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    let shoplists: { data: Shoplist[]; totalCount: number };
    try {
      shoplists = await this.shoplistRepository.findAll({ limit, offset });
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return {
      data: shoplists.data.map((sholist) => ({
        id: sholist.id,
        name: sholist.name,
      })),
      totalCount: shoplists.totalCount,
    };
  }

  async addItemsToPantry(
    { items, pantryId }: addItemsToPantryParam,
    prismaTransaction: TransactionClient,
  ) {
    try {
      await this.pantryService.update(
        {
          items: items,
        },
        pantryId,
        prismaTransaction,
      );
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }
  }

  async update(
    { items, name }: UpdateShoplistBody,
    pantryId: string,
    prismaTransaction?: TransactionClient,
    userId?: string,
  ): Promise<ShoplistServiceNamespace.UpdateResponse> {
    const shoplistToUpdate = await this.findOneByPantryId(pantryId);
    let updatedShoplist: Shoplist;

    const inCartItems = items.filter(
      (item) => item.state === ITEM_STATE.IN_CART,
    );

    const purchasedItems = items.filter(
      (item) => item.state === ITEM_STATE.PURCHASED,
    );

    const removedItems = [
      ...items.filter((item) => item.state === ITEM_STATE.REMOVED),
      ...purchasedItems,
    ].map((item) => item.id);

    try {
      await prisma.$transaction(async (prisma) => {
        updatedShoplist = await this.shoplistRepository.update(
          {
            shoplistId: shoplistToUpdate.id,
            inCartItems,
            removedItems,
            name,
          },
          prismaTransaction || prisma,
        );

        if (purchasedItems.length > 0 && pantryId) {
          await this.addItemsToPantry(
            {
              items: purchasedItems,
              pantryId,
            },
            prismaTransaction || prisma,
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
      id: updatedShoplist.id,
      name: updatedShoplist.name,
      items: updatedShoplist.shoplist_items.map((shoplistItem) => {
        return {
          id: shoplistItem.id,
          name: shoplistItem.product.name,
          portion: shoplistItem.portion,
          portionType: shoplistItem.portion_type,
          productId: shoplistItem.product.id,
          state: ITEM_STATE.IN_CART,
        };
      }),
    };
  }
}
