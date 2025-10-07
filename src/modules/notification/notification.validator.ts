import { z } from 'zod';

export const notificationValidator = {
  findAll: z.object({
    page: z.coerce
      .number({ invalid_type_error: 'page must be a number' })
      .min(1, { message: 'page must be ≥1' }),
    limit: z.coerce
      .number({ invalid_type_error: 'limit must be a number' })
      .min(0, { message: 'limit must be ≥0' }),
  }),

  updateNotificationDetails: z
    .object({
      id: z.string().uuid(),
      isExpired: z.boolean().optional(),
      isOut: z.boolean().optional(),
    })
    .refine(
      (data) => data.isExpired !== undefined || data.isOut !== undefined,
      {
        message: 'At least one field (isExpired or isOut) must be provided',
      },
    ),

  handleRead: z.object({
    ids: z.array(z.string().uuid()).min(1, 'at least one id is required'),
    isRead: z.boolean(),
  }),
};
