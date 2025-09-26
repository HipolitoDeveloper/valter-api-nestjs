import { Injectable } from '@nestjs/common';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { NotificationRepository } from './notification.repository';
import {
  NotificationControllerNamespace,
  NotificationRepositoryNamespace,
  NotificationServiceNamespace,
} from './notification.type';
import FindAllQuery = NotificationControllerNamespace.FindAllQuery;
import Notification = NotificationRepositoryNamespace.Notification;

@Injectable()
export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async findAll({
    limit,
    page,
  }: FindAllQuery): Promise<NotificationServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    let notifications: { data: Notification[]; totalCount: number };
    try {
      notifications = await this.notificationRepository.findAll({
        limit,
        offset,
      });
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return {
      data: notifications.data.map((notification) => ({
        id: notification.id,
        isRead: notification.is_read,
        type: notification.type,
        expiresDetails: notification.notification_expires
          ? {
              product: {
                name: notification.notification_expires.product.name,
              },
              isExpired: notification.notification_expires.is_expired,
              isOut: notification.notification_expires.is_out,
              daysSinceLastPurchase:
                notification.notification_expires.days_since_last_purchase,
            }
          : undefined,
      })),
      totalCount: notifications.totalCount,
    };
  }
}
