import { Injectable } from '@nestjs/common';
import { Prisma } from '.prisma/client';
import prisma from '../../../prisma/prisma';
import { NotificationRepositoryNamespace } from './notification.type';
import TransactionClient = Prisma.TransactionClient;

@Injectable()
export class NotificationRepository {
  async findById(notificationId: string) {
    return prisma.notification.findUnique({
      where: {
        id: notificationId,
      },
      include: {
        notification_expires: true,
      },
    });
  }

  async findAll({
    offset,
    limit,
  }: NotificationRepositoryNamespace.FindAllParams) {
    const where: Prisma.notificationWhereInput = {
      is_read: false,
    };

    const data = await prisma.notification.findMany({
      where,
      take: limit,
      skip: offset,
      select: {
        id: true,
        is_read: true,
        type: true,
        notification_expires: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
            is_expired: true,
            is_out: true,
            days_since_last_purchase: true,
          },
        },
      },
    });

    const totalCount = await prisma.notification.count({
      where,
    });

    return {
      data,
      totalCount: totalCount,
    };
  }

  async update(
    {
      id,
      isRead,
      isOut,
      isExpired,
    }: NotificationRepositoryNamespace.UpdateParams,
    pantryId: string,
    prismaTransaction?: TransactionClient,
  ) {
    const prismaInstance = prismaTransaction ?? prisma;

    const data = await prismaInstance.notification.update({
      where: { id: id },
      data: {
        is_read: isRead,
        notification_expires: {
          update: {
            data: {
              is_out: isOut,
              is_expired: isExpired,
            },
          },
        },
      },
      select: {
        id: true,
        is_read: true,
        type: true,
        notification_expires: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                pantry_items: {
                  select: {
                    id: true,
                  },
                  where: {
                    pantry_id: pantryId,
                  },
                },
              },
            },
            is_expired: true,
            is_out: true,
            days_since_last_purchase: true,
          },
        },
      },
    });

    return data;
  }

  async updateMany({
    ids,
    isRead,
  }: NotificationRepositoryNamespace.HandleReadParams) {
    await prisma.notification.updateMany({
      where: { id: { in: ids } },
      data: {
        is_read: isRead,
      },
    });

    return ids.map((id) => ({ id: id, isRead: isRead }));
  }

  async create(notifications: NotificationRepositoryNamespace.CreatePrams[]) {
    const createPromises = notifications.map((notification) =>
      prisma.notification.create({
        data: {
          user_id: notification.userId,
          type: notification.type,
          notification_expires: {
            create: {
              product_id: notification.productId,
              is_expired: false,
              is_out: false,
              days_since_last_purchase: notification.daysSinceLastPurchase,
              predicted_probability: notification.predictedProbability,
            },
          },
        },
        select: {
          id: true,
          is_read: true,
          type: true,
          notification_expires: {
            select: {
              product: {
                select: {
                  id: true,
                  name: true,
                },
              },
              is_expired: true,
              is_out: true,
              days_since_last_purchase: true,
            },
          },
        },
      }),
    );

    return await Promise.all(createPromises);
  }
}
