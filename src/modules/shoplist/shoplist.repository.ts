import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { ShoplistRepositoryNamespace } from './shoplist.type';
import { Prisma } from '.prisma/client';
import FindAllParams = ShoplistRepositoryNamespace.FindAllParams;
import UpdateParams = ShoplistRepositoryNamespace.UpdateParams;

@Injectable()
export class ShoplistRepository {
  create(data: Prisma.shoplistCreateInput) {
    return prisma.shoplist.create({
      data: data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  findOne(shoplistId: string) {
    return prisma.shoplist.findUnique({
      where: {
        id: shoplistId,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findAll({ offset, limit }: FindAllParams) {
    const data = await prisma.shoplist.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
      },
    });

    const totalCount = await prisma.shoplist.count({});

    return {
      data,
      totalCount: totalCount,
    };
  }

  async update({ shoplistId, items, name }: UpdateParams) {
    const data = await prisma.shoplist.update({
      select: {
        id: true,
        name: true,
        shoplist_items: {
          select: {
            id: true,
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            portion_type: true,
            portion: true,
          },
        },
      },
      where: {
        id: shoplistId,
      },
      data: {
        name,
        shoplist_items: {
          upsert: items.map((shoplistItem) => ({
            where: {
              shoplist_id_product_id: {
                product_id: shoplistItem.productId,
                shoplist_id: shoplistId,
              },
            },
            create: {
              portion: shoplistItem.portion,
              portion_type: shoplistItem.portionType,
              product_id: shoplistItem.productId,
            },
            update: {
              portion: shoplistItem.portion,
              portion_type: shoplistItem.portionType,
            },
          })),
        },
      },
    });
    return data;
  }
}
