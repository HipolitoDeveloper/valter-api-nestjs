import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { NotificationRepositoryNamespace } from './notification.type';
import { Prisma } from '.prisma/client';
import FindAllParams = NotificationRepositoryNamespace.FindAllParams;

@Injectable()
export class NotificationRepository {
  async findAll({ offset, limit }: FindAllParams) {
    const where: Prisma.notificationWhereInput = {};

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
}
