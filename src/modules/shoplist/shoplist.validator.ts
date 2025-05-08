import { z } from 'zod';
import { PORTION_TYPE } from './shoplist.enum';

export const PortionTypeSchema = z.nativeEnum(PORTION_TYPE);

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
    name: z
      .string({ message: 'name is required' })
      .min(2, { message: 'name is too short' })
      .optional(),
    items: z
      .array(
        z.object({
          productId: z
            .string({ message: 'id is required' })
            .uuid({ message: 'id is not a valid uuid' }),
          portion: z
            .number({ message: 'portion is required' })
            .positive({ message: 'portion must be a positive number' }),
          portionType: PortionTypeSchema,
        }),
        { message: 'items is required' },
      )
      .min(1, { message: 'at least one or more items should be added' }),
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
  shoplistId: z.object({
    id: z
      .string({ message: 'id is required' })
      .uuid({ message: 'id is not a valid uuid' }),
  }),
};

export const updateWithIdSchema = shoplistValidator.update.merge(
  shoplistValidator.shoplistId,
);
