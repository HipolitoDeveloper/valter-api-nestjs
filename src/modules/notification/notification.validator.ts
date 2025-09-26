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
};
