import { z } from 'zod';

export const userValidator = {
  createUser: z.object({
    email: z.string(),
    firstName: z.string(),
    surname: z.string(),
    password: z.string(),
    birthday: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, z.date()),
    pantryName: z.string(),
  }),
  updateUser: z.object({
    email: z.string(),
    firstName: z.string(),
    surname: z.string(),
    password: z.string().optional(),
    birthday: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) {
        return new Date(arg);
      }
    }, z.date()),
    id: z.string(),
  }),
};
