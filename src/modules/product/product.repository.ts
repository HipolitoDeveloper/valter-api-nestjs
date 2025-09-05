import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { ProductRepositoryNamespace } from './product.type';
import { Prisma } from '.prisma/client';
import FindAllParams = ProductRepositoryNamespace.FindAllParams;

@Injectable()
export class ProductRepository {
  create(data: Prisma.productCreateInput) {
    return prisma.product.create({
      data: data,
      select: {
        id: true,
        name: true,
        default_portion_type: true,
        valid_for_days: true,
        default_portion: true,
      },
    });
  }

  update(productData: Prisma.productUpdateInput) {
    return prisma.product.update({
      data: {
        ...productData,
      },
      where: {
        id: productData.id as string,
      },
    });
  }

  findOne(productId: string) {
    return prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        name: true,
        default_portion_type: true,
        valid_for_days: true,
        default_portion: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll({ offset, limit, productName }: FindAllParams) {
    const where: Prisma.productWhereInput = {};

    if (productName) {
      where.name = {
        contains: productName.trim(),
        mode: 'insensitive',
      };
    }

    const data = await prisma.product.findMany({
      where,
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        default_portion_type: true,
        valid_for_days: true,
        default_portion: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalCount = await prisma.product.count({});

    return {
      where,
      data,
      totalCount: totalCount,
    };
  }

  async findAllRecommendedProducts(userId: string, pantryId: string) {

    const data = await prisma.product_recurrence_score.findMany({
      where: {
        user_id: userId,
        product: {
          shoplist_item: {
            none: {
              shoplist: {
                pantry_id: pantryId,
              },
            },
          },
          pantry_items: {
            none: {
              pantry_id: pantryId,
            },
          },
        },
      },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            default_portion_type: true,
            valid_for_days: true,
            default_portion: true,
          },
        },
      },
      take: 10,
      orderBy: { recurrence_score: 'desc' },
    });
    return {
      data: data.map((item) => item.product),
    };
  }
}
