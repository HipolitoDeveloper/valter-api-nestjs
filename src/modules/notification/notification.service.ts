import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { PantryService } from '../pantry/pantry.service';
import { ITEM_STATE } from '../shoplist/shoplist.enum';
import { NotificationRepository } from './notification.repository';
import {
  NotificationControllerNamespace,
  NotificationRepositoryNamespace,
  NotificationServiceNamespace,
} from './notification.type';
import FindAllQuery = NotificationControllerNamespace.FindAllQuery;
import Notification = NotificationRepositoryNamespace.Notification;
import UpdateNotificationDetailsQuery = NotificationControllerNamespace.UpdateNotificationDetailsQuery;
import HandleReadQuery = NotificationControllerNamespace.HandleReadQuery;

@Injectable()
export class NotificationService {
  constructor(
    private notificationRepository: NotificationRepository,
    private pantryService: PantryService,
  ) {}

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

  async findById(
    id: string,
  ): Promise<NotificationServiceNamespace.findByIdResponse> {
    let notification;

    try {
      notification = await this.notificationRepository.findById(id);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    return notification;
  }

  async updateNotificationDetails(
    data: UpdateNotificationDetailsQuery,
    pantryId: string,
    userId: string,
  ): Promise<NotificationServiceNamespace.UpdateResponse> {
    const existingNotification = await this.findById(data.id);

    if (!existingNotification) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    let notification;
    try {
      await prisma.$transaction(async (prisma) => {
        notification = await this.notificationRepository.update(
          {
            ...data,
            isRead: true,
          },
          pantryId,
          prisma,
        );

        if (data.isOut || data.isExpired) {
          const itemState = data.isOut ? ITEM_STATE.OUT : ITEM_STATE.EXPIRED;

          await this.pantryService.update(
            {
              items: [
                {
                  productId: notification.notification_expires.product.id,
                  id: notification.notification_expires.product.pantry_items[0]
                    .id,
                  state: itemState,
                },
              ],
            },
            pantryId,
            prisma,
            userId,
          );
        }
      });
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    return this.formatNotificationResponse(notification);
  }

  async handleRead(
    data: HandleReadQuery,
  ): Promise<NotificationServiceNamespace.UpdateResponse> {
    let notifications;
    try {
      notifications = await this.notificationRepository.updateMany({
        ids: data.ids,
        isRead: data.isRead,
      });
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    return notifications.map((updatedNotification) => ({
      isRead: updatedNotification.isRead,
      id: updatedNotification.id,
    }));
  }

  private formatNotificationResponse(
    notification: Notification,
  ): NotificationServiceNamespace.UpdateResponse {
    return {
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
    };
  }

  async createNotifications(
    notification: NotificationRepositoryNamespace.CreatePrams[],
  ): Promise<NotificationServiceNamespace.CreateResponse[]> {
    let createdNotifications: Notification[];

    try {
      createdNotifications =
        await this.notificationRepository.create(notification);
    } catch (error) {
      throw new ErrorException(ERRORS.DATABASE_ERROR, error);
    }

    return createdNotifications.map((createdNotification) => ({
      id: createdNotification.id,
      isRead: createdNotification.is_read,
      type: createdNotification.type,
      expiresDetails: createdNotification.notification_expires
        ? {
            product: {
              name: createdNotification.notification_expires.product.name,
            },
            isExpired: createdNotification.notification_expires.is_expired,
            isOut: createdNotification.notification_expires.is_out,
            daysSinceLastPurchase:
              createdNotification.notification_expires.days_since_last_purchase,
          }
        : undefined,
    }));
  }
}
