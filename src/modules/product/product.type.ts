import { z } from 'zod';
import { productValidator } from './product.validator';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProductRepositoryNamespace {
  export type Product = Pick<
    Prisma.ProductGroupByOutputType,
    'name' | 'id' | 'default_portion_type' | 'default_portion' | 'valid_until'
  > & {
    category?: {
      id: string;
      name: string;
    };
  };

  export type FindAllParams = {
    limit: number;
    offset: number;
    productName?: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProductControllerNamespace {
  export type FindOneParam = z.infer<typeof productValidator.findOne>;
  export type FindAllQuery = z.infer<typeof productValidator.findAll>;
  export type CreateProductBody = z.infer<typeof productValidator.create>;
  export type UpdateProductBody = z.infer<typeof productValidator.update>;
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ProductServiceNamespace {
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
    category: {
      id: string;
      name: string;
    };
  };

  export type FindAllResponse = {
    data: {
      id: string;
      name: string;
    }[];
    totalCount: number;
  };
}
