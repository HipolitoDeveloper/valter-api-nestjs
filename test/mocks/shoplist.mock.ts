import { PORTION_TYPE } from '../../src/modules/shoplist/shoplist.enum';

export const SHOPLIST_MOCK = {
  SERVICE: {
    createShoplistBody: {
      name: 'Shoplist Name',
      pantryId: 'id',
    },

    updateShoplistBody: {
      name: 'Shoplist',
      items: [
        {
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
        },
      ],
    },

    shoplistId: 'id',

    pagination: {
      limit: 10,
      page: 1,
    },

    createShoplistResponse: {
      id: 'id',
      name: 'Shoplist Name',
    },

    updateShoplistResponse: {
      id: 'id',
      name: 'Shoplist name',
      items: [
        {
          id: 'id',
          name: 'Product name',
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
        },
      ],
    },

    findAllResponse: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Shoplist First',
        },
      ],
      totalCount: 10,
    },
  },
  REPOSITORY: {
    create: {
      id: 'id',
      name: 'Shoplist name',
    },

    update: {
      id: 'id',
      name: 'Shoplist name',
      shoplist_items: [
        {
          id: 'id',
          portion: 100,
          portion_type: PORTION_TYPE.GRAMS,
          product: {
            id: 'productId',
            name: 'Product name',
          },
        },
      ],
    },

    findOne: {
      id: 'id',
      name: 'Shoplist name',
    },

    findAll: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Shoplist First',
        },
      ],
      totalCount: 10,
    },
  },
};
