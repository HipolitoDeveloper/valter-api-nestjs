import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { Prisma } from '.prisma/client';

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
}
