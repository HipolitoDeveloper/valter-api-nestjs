import { ItemState, PortionType } from '@prisma/client';
import { Prisma } from '.prisma/client';

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ItemTransactionRepositoryNamespace {
  export type ItemTransaction = Pick<
    Prisma.Item_transactionGroupByOutputType,
    'id'
  > & {
    shoplist_items?: {
      id: string;
      product: {
        id: string;
        name: string;
      };
      portion: number;
      portion_type: PortionType;
    }[];
  };
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ItemTransactionServiceNamespace {
  export type CreateResponse = {
    userId: string;
    items: {
      portion?: number;
      portionType?: PortionType;
      productId?: string;
      state?: ItemState;
      validForDays?: number;
    }[];
  };
}
