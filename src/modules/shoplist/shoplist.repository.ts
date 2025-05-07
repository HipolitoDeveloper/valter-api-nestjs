import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { ShoplistRepositoryNamespace } from './shoplist.type';
import { Prisma } from '.prisma/client';
import FindAllParams = ShoplistRepositoryNamespace.FindAllParams;

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

  update(shoplistData: Prisma.shoplistUpdateInput) {
    return prisma.shoplist.update({
      data: {
        ...shoplistData,
      },
      where: {
        id: shoplistData.id as string,
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
}
