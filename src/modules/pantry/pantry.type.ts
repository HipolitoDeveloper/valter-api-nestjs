import { PortionType } from '@prisma/client';
import { z } from 'zod';
import { pantryValidator } from './pantry.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryRepositoryNamespace {
  export type Pantry = Pick<Prisma.PantryGroupByOutputType, 'name' | 'id'> & {
    shoplist?: {
      id: string;
    };
    pantry_items?: {
      id: string;
      product: {
        id: string;
        name: string;
      };
      portion: number;
      portion_type: PortionType;
    }[];
  };

  export type FindAllParams = {
    limit: number;
    offset: number;
  };

  export type UpdateParams = {
    id: string;
    inPantryItems: {
      id?: string;
      productId?: string;
      portion?: number;
      portionType?: PortionType;
      validUntil?: string;
    }[];
    removedItems: string[];
    name?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace PantryControllerNamespace {
  export type FindOneParam = z.infer<typeof pantryValidator.findOne>;
  export type FindAllQuery = z.infer<typeof pantryValidator.findAll>;
  export type CreatePantryBody = z.infer<typeof pantryValidator.create>;
  export type UpdatePantryBody = z.infer<typeof pantryValidator.update>;

  export type addItemsToShoplistParam = {
    items: UpdatePantryBody['items'];
    pantryId: string;
  };
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
    items: {
      id: string;
      name: string;
      portion: number;
      portionType: string;
      productId: string;
    }[];
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
