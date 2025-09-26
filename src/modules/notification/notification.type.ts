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
    notification_expires: {
      product: {
        id: string;
        name: string;
      };
      is_expired: boolean;
      is_out: boolean;
      days_since_last_purchase: number;
    };
  };

  export type FindAllParams = {
    limit: number;
    offset: number;
  };
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationControllerNamespace {
  export type FindAllQuery = z.infer<typeof notificationValidator.findAll>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationServiceNamespace {
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
}
