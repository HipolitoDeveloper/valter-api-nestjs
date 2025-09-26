export const NOTIFICATION_MOCK = {
  SERVICE: {
    pagination: {
      limit: 10,
      page: 1,
    },

    findAllResponse: {
      data: [
        {
          id: '1625b7f3-85e9-4e82-8f58-57dd2f17865e',
          isRead: true,
          type: 'PRODUCT_EXPIRES',
          expiresDetails: {
            product: {
              name: 'Massa pastel redonda',
            },
            isExpired: false,
            isOut: false,
            daysSinceLastPurchase: 100,
          },
        },
      ],
      totalCount: 1
    },
  },
  REPOSITORY: {
    findAll: {
      data: [
        {
          id: '1625b7f3-85e9-4e82-8f58-57dd2f17865e',
          is_read: true,
          type: 'PRODUCT_EXPIRES',
          notification_expires: {
            product: {
              id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
              name: 'Massa pastel redonda',
            },
            is_expired: false,
            is_out: false,
            days_since_last_purchase: 100,
          },
        },
      ],
      totalCount: 1,
    },
  },
};
