import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { PantryRepositoryNamespace } from './pantry.type';
import { Prisma } from '.prisma/client';
import FindAllParams = PantryRepositoryNamespace.FindAllParams;
import UpdateParams = PantryRepositoryNamespace.UpdateParams;
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class PantryRepository {
  create(data: Prisma.pantryCreateInput) {
    return prisma.pantry.create({
      data: data,
      select: {
        id: true,
        name: true,
      },
    });
  }

  update(
    { id, inPantryItems, removedItems, name }: UpdateParams,
    prismaTransaction?: TransactionClient,
  ) {
    const prismaInstance = prismaTransaction ?? prisma;

    return prismaInstance.pantry.update({
      select: {
        id: true,
        name: true,
        pantry_items: {
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
        id,
      },
      data: {
        name,
        pantry_items: {
          deleteMany: {
            id: {
              in: removedItems,
            },
          },
          upsert: inPantryItems.map((pantryItem) => ({
            where: {
              pantry_id_product_id: {
                product_id: pantryItem.productId,
                pantry_id: id,
              },
            },
            create: {
              portion: pantryItem.portion,
              portion_type: pantryItem.portionType,
              product_id: pantryItem.productId,
            },
            update: {
              portion: pantryItem.portion,
              portion_type: pantryItem.portionType,
            },
          })),
        },
      },
    });
  }

  findOne(pantryId: string) {
    return prisma.pantry.findUnique({
      where: {
        id: pantryId,
      },
      select: {
        id: true,
        name: true,
        shoplist: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async findAll({ offset, limit }: FindAllParams) {
    const data = await prisma.pantry.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
      },
    });

    const totalCount = await prisma.pantry.count({});

    return {
      data,
      totalCount: totalCount,
    };
  }
}
