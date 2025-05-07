export const SHOPLIST_MOCK = {
  SERVICE: {
    createShoplistBody: {
      name: 'Shoplist Name',
      pantryId: 'id',
    },

    updateShoplistBody: {
      id: 'id',
      name: 'Shoplist',
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
