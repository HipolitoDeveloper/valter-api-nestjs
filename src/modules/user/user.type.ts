import { z } from 'zod';
import { userValidator } from './user.validator';
import { Prisma } from '.prisma/client';

export type CurrentUser = {
  id: string;
  refreshToken: string;
  pantryId: string;
};

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserRepositoryNamespace {
  export type User = Pick<
    Prisma.UserGroupByOutputType,
    'id' | 'firstname' | 'surname' | 'email'
  > & {
    pantry: {
      id: string;
      name: string;
    };
    password?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserControllerNamespace {
  export type CreateUserBody = z.infer<typeof userValidator.createUser>;
  export type UpdateUserBody = z.infer<typeof userValidator.updateUser>;
}
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace UserServiceNamespace {
  export type CreateResponse = {
    id: string;
    firstName: string;
    email: string;
    surname: string;
    pantry?: {
      id: string;
      name: string;
    };
  };

  export type UpdateResponse = {
    id: string;
    firstName: string;
    email: string;
  };

  export type FindOneByIdResponse = {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    pantry?: {
      id: string;
      name: string;
    };
  };

  export type FindOneByEmailResponse = {
    id: string;
    firstName: string;
    surname: string;
    email: string;
    password?: string;
    pantry?: {
      id: string;
      name: string;
    };
  };

  export type FindAllResponse = {
    id: string;
    firstName: string;
    surname: string;
    email: string;
  }[];
}
