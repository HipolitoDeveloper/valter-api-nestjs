import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../../../prisma/prisma';
import { UserRepositoryNamespace } from './user.type';
import User = UserRepositoryNamespace.User;

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
        pantry: {
          select: {
            id: true,
            name: true,
          },
        },
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
        surname: true,
        pantry: {
          select: {
            name: true,
          },
        },
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
        pantry: {
          select: {
            id: true,
            name: true,
          },
        },
        profile: {
          select: {
            profile_actions: {
              select: {
                action: {
                  select: {
                    name: true,
                    resource: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: {
        id: userId,
      },
    }) as unknown as User;
  }

  async findByEmail(email: string) {
    const userResult = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        firstname: true,
        surname: true,
        password: true,
        pantry: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      where: {
        email: email,
      },
    });

    if (userResult) {
      return {
        id: userResult?.id,
        email: userResult?.email,
        firstname: userResult?.firstname,
        surname: userResult?.surname,
        password: userResult?.password || undefined,
        pantry: {
          id: userResult?.pantry?.id,
          name: userResult?.pantry?.name,
        },
      } as User;
    } else {
      return undefined;
    }
  }
}
