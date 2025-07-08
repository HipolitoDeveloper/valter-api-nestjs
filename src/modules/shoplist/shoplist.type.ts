import { PortionType } from '@prisma/client';
import { z } from 'zod';
import { updateWithIdSchema, shoplistValidator } from './shoplist.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoplistRepositoryNamespace {
  export type Shoplist = Pick<
    Prisma.ShoplistGroupByOutputType,
    'name' | 'id'
  > & {
    shoplist_items?: {
      id: string;
      product: {
        id: string;
        name: string;
        valid_until: Date;
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
    shoplistId: string;
    inCartItems: {
      id?: string;
      productId?: string;
      portion?: number;
      portionType?: PortionType;
    }[];
    removedItems: string[];
    name?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoplistControllerNamespace {
  export type FindOneParam = z.infer<typeof shoplistValidator.findOne>;
  export type FindAllQuery = z.infer<typeof shoplistValidator.findAll>;
  export type CreateShoplistBody = z.infer<typeof shoplistValidator.create>;
  export type UpdateShoplistBody = z.infer<typeof shoplistValidator.update>;

  export type ShoplistIdParam = z.infer<typeof shoplistValidator.shoplistId>;
  export type UpdateWithIdBody = z.infer<typeof updateWithIdSchema>;

  export type addItemsToPantryParam = {
    items: UpdateWithIdBody['items'];
    pantryId: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoplistServiceNamespace {
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
    items: {
      id: string;
      name: string;
      portion: number;
      portionType: string;
      productId: string;
      validUntil: Date;
    }[];
  };

  export type FindAllResponse = {
    data: {
      id: string;
      name: string;
    }[];
    totalCount: number;
  };
}
