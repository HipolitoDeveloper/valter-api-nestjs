export const NOTIFICATION_MOCK = {
  SERVICE: {
    pagination: {
      limit: 10,
      page: 1,
    },
    findAllResponse: {
      data: [
        {
          id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
          isRead: false,
          type: 'PRODUCT_EXPIRES',
          expiresDetails: {
            product: {
              name: 'Test Product',
            },
            isExpired: false,
            isOut: true,
            daysSinceLastPurchase: 5,
          },
        },
      ],
      totalCount: 1,
    },
    updateQuery: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      isRead: true,
      isOut: false,
      isExpired: true,
    },
    updateResponse: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      isRead: true,
      type: 'PRODUCT_EXPIRES',
      expiresDetails: {
        product: {
          name: 'Test Product',
        },
        isExpired: true,
        isOut: false,
        daysSinceLastPurchase: 3,
      },
    },
    updateNotificationDetailsResponse: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      isRead: true,
      type: 'PRODUCT_EXPIRES',
      expiresDetails: {
        product: {
          name: 'Test Product',
        },
        isExpired: true,
        isOut: false,
        daysSinceLastPurchase: 3,
      },
    },
    handleReadResponse: [
      {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        isRead: true,
      },
    ],
    updateNotificationDetailsData: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      isExpired: true,
      isOut: false,
    },
    handleReadData: {
      ids: ['8aaa1cb2-38ee-4100-a56c-789c9e5ffe48'],
      isRead: true,
    },
    notification: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      is_read: true,
      type: 'EXPIRES',
      notification_expires: {
        product: {
          id: 'product-id',
          name: 'Test Product',
        },
        is_expired: false,
        is_out: true,
        days_since_last_purchase: 5,
      },
    },
  },
  REPOSITORY: {
    findAll: {
      data: [
        {
          id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
          is_read: false,
          type: 'PRODUCT_EXPIRES',
          notification_expires: {
            product: {
              name: 'Test Product',
            },
            is_expired: false,
            is_out: true,
            days_since_last_purchase: 5,
          },
        },
      ],
      totalCount: 1,
    },
    findById: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      is_read: false,
      type: 'PRODUCT_EXPIRES',
      notification_expires: {
        product: {
          name: 'Test Product',
        },
        is_expired: false,
        is_out: false,
        days_since_last_purchase: 3,
      },
    },
    update: {
      id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
      is_read: true,
      type: 'PRODUCT_EXPIRES',
      notification_expires: {
        product: {
          name: 'Test Product',
        },
        is_expired: true,
        is_out: false,
        days_since_last_purchase: 3,
      },
    },
    updateMany: [
      {
        id: '8aaa1cb2-38ee-4100-a56c-789c9e5ffe48',
        is_read: true,
      },
    ],
  },
};
