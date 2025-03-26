import { z } from 'zod';

export const authValidator = {
  signIn: z.object({
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({}),
    password: z.string(),
  }),
  finishRegister: z.object({
    password: z.string(),
    email: z
      .string({
        required_error: 'email is required',
      })
      .email({}),
  }),
};

export type SigninBody = z.infer<typeof authValidator.signIn>;
export type FinishRegisterBody = z.infer<typeof authValidator.finishRegister>;
