import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../../../prisma/prisma';

@Injectable()
export class UserRepository {
  create(data: Prisma.userCreateInput) {
    return prisma.user.create({
      data: data,
      select: {
        id: true,
        firstname: true,
        email: true,
        surname: true,
      },
    });
  }

  update(
    data: Prisma.userUpdateInput,
    userId: string,
    prismaTransaction?: PrismaClient,
  ) {
    const prismaInstance: PrismaClient = prismaTransaction ?? prisma;

    return prismaInstance.user.update({
      where: {
        id: userId,
      },
      data: data,
      select: {
        id: true,
        firstname: true,
        email: true,
      },
    });
  }

  findAll() {
    return [];
  }

  async findById(userId: string) {
    return prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        firstname: true,
        surname: true,
      },
      where: {
        id: userId,
      },
    });
  }
}
