import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { differenceInDays, sub, subDays } from 'date-fns';
import { ERRORS } from '../../../common/enum';
import { ErrorException } from '../../../common/exceptions/error.exception';
import { NotificationService } from '../notification.service';
import { NotificationExpiresConfig } from './notification-expires.config';
import { NotificationExpiresServiceNamespace } from './notification-expires.type';

@Injectable()
export class NotificationExpiresService {
  constructor(
    private notificationExpiresConfig: NotificationExpiresConfig,
    private notificationService: NotificationService,
  ) {}

  async predict(
    userId: string,
  ): Promise<NotificationExpiresServiceNamespace.PredictResponse> {
    let notificationExpires: NotificationExpiresServiceNamespace.NotificationExpires;
    try {
      const axios = await this.notificationExpiresConfig.post('/predict', {
        user_id: userId, // Replace with actual user ID
      });
      notificationExpires =
        axios.data as NotificationExpiresServiceNamespace.NotificationExpires;
    } catch (error) {
      throw new ErrorException(ERRORS.INTEGRATION_ERROR, error);
    }

    return notificationExpires.items.map((item) => ({
      productId: item.product_id,
      probabilityOutOrExpired: Number(item.probability_out_or_expired),
      userId: notificationExpires.user_id,
      daysSinceLastPurchase: item.days_since_purchase,
      lastNotificationAt: item.last_notification_at,
    }));
  }

  buildNotificationExpires(
    expiresPredictions: NotificationExpiresServiceNamespace.PredictResponse,
  ) {
    const formattedNotification = expiresPredictions
      .filter(
        (notificationExpires) =>
          notificationExpires.probabilityOutOrExpired > 0.1 &&
          (differenceInDays(
            notificationExpires.lastNotificationAt,
            new Date(),
          ) > 1 ||
            notificationExpires.lastNotificationAt === 'NaT'),
      )
      .map((notificationExpires) => ({
        userId: notificationExpires.userId,
        productId: notificationExpires.productId,
        type: NotificationType.PRODUCT_EXPIRES,
        predictedProbability: notificationExpires.probabilityOutOrExpired,
        daysSinceLastPurchase: notificationExpires.daysSinceLastPurchase,
        lastNotificationAt: notificationExpires.lastNotificationAt,
      }));

    return formattedNotification;
  }

  async callNotificationsExpires() {
    const users = ['8acbd1d0-5060-4a74-9fac-6ad241a2d598'];

    const predictPromises = users.map(async (userId) => {
      return this.predict(userId);
    });

    const promiseResponses = await Promise.all(predictPromises);

    const expiresPredictions = promiseResponses.flat();

    if (expiresPredictions.length === 0) {
      return { message: 'No notifications to create' };
    }

    const notificationExpires =
      this.buildNotificationExpires(expiresPredictions);

    try {
      await this.notificationService.createNotifications(notificationExpires);
    } catch (error) {
      throw new ErrorException(error);
    }
  }
}
