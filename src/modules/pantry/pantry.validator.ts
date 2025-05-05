import { z } from 'zod';

export const pantryValidator = {
  create: z.object({
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
    page: z
      .number({ message: 'page is required' })
      .min(1, { message: 'page must be greater than or equal to 1' }),
    limit: z
      .number({ message: 'limit is required' })
      .min(0, { message: 'limit must be greater than or equal to 0' }),
  }),
};
