import { z } from 'zod';
import { shoplistValidator } from './shoplist.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoplistRepositoryNamespace {
  export type Shoplist = Pick<Prisma.ShoplistGroupByOutputType, 'name' | 'id'>;

  export type FindAllParams = {
    limit: number;
    offset: number;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ShoplistControllerNamespace {
  export type FindOneParam = z.infer<typeof shoplistValidator.findOne>;
  export type FindAllQuery = z.infer<typeof shoplistValidator.findAll>;
  export type CreateShoplistBody = z.infer<typeof shoplistValidator.create>;
  export type UpdateShoplistBody = z.infer<typeof shoplistValidator.update>;
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
