import { z } from 'zod';
import { pantryValidator } from './pantry.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryRepositoryNamespace {
  export type Pantry = Pick<Prisma.PantryGroupByOutputType, 'name' | 'id'>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryControllerNamespace {
  export type CreatePantryBody = z.infer<typeof pantryValidator.createPantry>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryServiceNamespace {
  export type CreateResponse = {
    name: string;
  };
}
