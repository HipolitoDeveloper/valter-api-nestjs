import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { PantryRepositoryNamespace } from './pantry.type';
import { Prisma } from '.prisma/client';
import FindAllParams = PantryRepositoryNamespace.FindAllParams;

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

  update(pantryData: Prisma.pantryUpdateInput) {
    return prisma.pantry.update({
      data: {
        ...pantryData,
      },
      where: {
        id: pantryData.id as string,
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
      },
    });
  }

  findAll({ offset, limit }: FindAllParams) {
    return prisma.pantry.findMany({
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
      },
    });
  }
}
