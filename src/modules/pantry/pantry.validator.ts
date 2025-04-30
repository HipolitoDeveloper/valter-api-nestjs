import { z } from 'zod';

export const pantryValidator = {
  createPantry: z.object({
    name: z
      .string({ message: 'name is required' })
      .min(2, { message: 'name is too short' }),
  }),
};

