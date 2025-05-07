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
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll({ offset, limit }: FindAllParams) {
    const data = await prisma.product.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
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
      data,
      totalCount: totalCount,
    };
  }
}
