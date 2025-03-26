import { z } from 'zod';

export const userValidator = {
  createUser: z.object({
    email: z.string(),
    firstName: z.string(),
    surname: z.string(),
    password: z.string().optional(),
    birthday: z.string(),
  }),
  updateUser: z.object({
    email: z.string(),
    firstName: z.string(),
    surname: z.string(),
    password: z.string().optional(),
    birthday: z.string(),
    id: z.string(),
  }),
};
