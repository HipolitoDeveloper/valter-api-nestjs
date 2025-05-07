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
import UpdateShoplistBody = ShoplistControllerNamespace.UpdateShoplistBody;
import FindAllQuery = ShoplistControllerNamespace.FindAllQuery;

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

  async update(
    shoplist: UpdateShoplistBody,
  ): Promise<ShoplistServiceNamespace.UpdateResponse> {
    let updatedShoplist: Shoplist;
    try {
      updatedShoplist = await this.shoplistRepository.update(shoplist);
    } catch (error) {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR, error);
    }

    return {
      id: updatedShoplist.id,
      name: updatedShoplist.name,
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
}
