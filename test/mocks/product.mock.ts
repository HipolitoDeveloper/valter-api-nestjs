export const PRODUCT_MOCK = {
  SERVICE: {
    createProductBody: {
      name: 'Product Name',
      categoryId: 'id',
    },

    updateProductBody: {
      id: 'id',
      name: 'Product',
    },

    productId: 'id',

    pagination: {
      limit: 10,
      page: 1,
    },

    createProductResponse: {
      id: 'id',
      name: 'Product Name',
    },

    findAllResponse: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Product First',
          category: {
            id: 'id',
            name: 'Category name',
          },
        },
      ],
      totalCount: 10,
    },
  },
  REPOSITORY: {
    create: {
      id: 'id',
      name: 'Product name',
      validUntil: new Date('2023-10-01T00:00:00.000Z'),
    },

    update: {
      id: 'id',
      name: 'Product name',
    },

    findOne: {
      id: 'id',
      name: 'Product name',
      category: {
        id: 'id',
        name: 'Category name',
      },
    },

    findAll: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Product First',
          category: {
            id: 'id',
            name: 'Category name',
          },
        },
      ],
      totalCount: 10,
    },
  },
};
