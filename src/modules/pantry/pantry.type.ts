import { z } from 'zod';
import { pantryValidator } from './pantry.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryRepositoryNamespace {
  export type Pantry = Pick<Prisma.PantryGroupByOutputType, 'name' | 'id'>;

  export type FindAllParams = {
    limit: number;
    offset: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryControllerNamespace {
  export type FindOneParam = z.infer<typeof pantryValidator.findOne>;
  export type FindAllQuery = z.infer<typeof pantryValidator.findAll>;
  export type CreatePantryBody = z.infer<typeof pantryValidator.create>;
  export type UpdatePantryBody = z.infer<typeof pantryValidator.update>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryServiceNamespace {
  export type CreateResponse = {
    id: string;
    name: string;
  };

  export type UpdateResponse = {
    id: string;
    name: string;
  };

  export type FindOneResponse = {
    id: string;
    name: string;
  };

  export type FindAllResponse = {
    data: {
      id: string;
      name: string;
    }[];
    totalCount: number;
  };
}
