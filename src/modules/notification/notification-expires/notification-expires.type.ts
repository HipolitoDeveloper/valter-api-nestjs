// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace NotificationExpiresServiceNamespace {
  export type NotificationExpires = {
    user_id: string;
    items: {
      product_id: string;
      probability_out_or_expired: number;
      days_since_purchase: number;
      last_notification_at: string;
    }[];
  };

  export type PredictResponse = {
    productId: string;
    probabilityOutOrExpired: number;
    userId: string;
    daysSinceLastPurchase: number;
    lastNotificationAt: string;
  }[];
}
