import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { Prisma } from '.prisma/client';
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class ItemTransactionRepository {
  createMany(
    data: Prisma.item_transactionCreateManyInput[],
    prismaTransaction?: TransactionClient,
  ) {
    const prismaInstance = prismaTransaction ?? prisma;
    return prismaInstance.item_transaction.createMany({
      skipDuplicates: true,
      data: data,
    });
  }

  getTransactionCode(productId: string, userId: string) {
    return prisma.item_transaction.findFirst({
      where: {
        product_id: productId,
        user_id: userId,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        transaction_code: true,
        state: true,
      },
    });
  }
}
