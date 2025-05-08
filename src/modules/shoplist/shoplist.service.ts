import { Injectable } from '@nestjs/common';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { ShoplistRepository } from './shoplist.repository';
import {
  ShoplistControllerNamespace,
  ShoplistRepositoryNamespace,
  ShoplistServiceNamespace,
} from './shoplist.type';
import Shoplist = ShoplistRepositoryNamespace.Shoplist;
import CreateShoplistBody = ShoplistControllerNamespace.CreateShoplistBody;
import FindAllQuery = ShoplistControllerNamespace.FindAllQuery;
import UpdateWithIdBody = ShoplistControllerNamespace.UpdateWithIdBody;

@Injectable()
export class ShoplistService {
  constructor(private shoplistRepository: ShoplistRepository) {}

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

  async update({
    id,
    items,
    name,
  }: UpdateWithIdBody): Promise<ShoplistServiceNamespace.UpdateResponse> {
    let shoplist: Shoplist;

    try {
      shoplist = await this.shoplistRepository.update({
        shoplistId: id,
        items,
        name,
      });
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }

    return {
      id: shoplist.id,
      name: shoplist.name,
      items: shoplist.shoplist_items.map((shoplistItem) => {
        return {
          id: shoplistItem.id,
          name: shoplistItem.product.name,
          portion: shoplistItem.portion,
          portionType: shoplistItem.portion_type,
          productId: shoplistItem.product.id,
        };
      }),
    };
  }
}
