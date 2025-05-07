import { z } from 'zod';

export const shoplistValidator = {
  create: z.object({
    pantryId: z
      .string({ message: 'id is required' })
      .uuid({ message: 'id is not a valid uuid' }),
    name: z
      .string({ message: 'name is required' })
      .min(2, { message: 'name is too short' }),
  }),
  update: z.object({
    id: z
      .string({ message: 'id is required' })
      .uuid({ message: 'id is not a valid uuid' }),
    name: z
      .string({ message: 'name is required' })
      .min(2, { message: 'name is too short' }),
  }),
  findOne: z.object({
    id: z
      .string({ message: 'id is required' })
      .uuid({ message: 'id is not a valid uuid' }),
  }),
  findAll: z.object({
    page: z.coerce
      .number({ invalid_type_error: 'page must be a number' })
      .min(1, { message: 'page must be ≥1' }),
    limit: z.coerce
      .number({ invalid_type_error: 'limit must be a number' })
      .min(0, { message: 'limit must be ≥0' }),
  }),
};
