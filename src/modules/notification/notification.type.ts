// eslint-disable-next-line @typescript-eslint/no-namespace
import { NotificationType } from '@prisma/client';
import { z } from 'zod';
import { notificationValidator } from './notification.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationRepositoryNamespace {
  export type Notification = Pick<
    Prisma.NotificationGroupByOutputType,
    'id' | 'is_read' | 'type'
  > & {
    user_id?: string;
    notification_expires: {
      product: {
        id: string;
        name: string;
      };
      is_expired: boolean;
      is_out: boolean;
      days_since_last_purchase: number;
      predicted_probability?: number;
    };
  };

  export type FindAllParams = {
    limit: number;
    offset: number;
  };

  export type UpdateParams = {
    id?: string;
    isRead?: boolean;
    isOut?: boolean;
    isExpired?: boolean;
  };

  export type HandleReadParams = {
    ids?: string[];
    isRead?: boolean;
  };

  export type CreatePrams = {
    userId: string;
    type: NotificationType;
    productId: string;
    predictedProbability: number;
    daysSinceLastPurchase: number;
    lastNotificationAt: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationControllerNamespace {
  export type FindAllQuery = z.infer<typeof notificationValidator.findAll>;
  export type UpdateNotificationDetailsQuery = z.infer<
    typeof notificationValidator.updateNotificationDetails
  >;
  export type HandleReadQuery = z.infer<
    typeof notificationValidator.handleRead
  >;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationServiceNamespace {
  export type CreateResponse = {
    id: string;
    isRead: boolean;
    type: NotificationType;
    expiresDetails?: {
      product: {
        name: string;
      };
      isExpired: boolean;
      isOut: boolean;
      daysSinceLastPurchase: number;
    };
  };

  export type FindAllResponse = {
    data: {
      id: string;
      isRead: boolean;
      type: NotificationType;
      expiresDetails?: {
        product: {
          name: string;
        };
        isExpired: boolean;
        isOut: boolean;
        daysSinceLastPurchase: number;
      };
    }[];
    totalCount: number;
  };

  export type UpdateResponse = {
    id: string;
    isRead: boolean;
    type: NotificationType;
    expiresDetails?: {
      product: {
        name: string;
      };
      isExpired: boolean;
      isOut: boolean;
      daysSinceLastPurchase: number;
    };
  };

  export type findByIdResponse = {
    id: string;
    isRead: boolean;
    type: NotificationType;
    expiresDetails?: {
      product: {
        name: string;
      };
      isExpired: boolean;
      isOut: boolean;
      daysSinceLastPurchase: number;
    };
  };
}
