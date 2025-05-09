import { ITEM_STATE, PORTION_TYPE } from '../../src/modules/shoplist/shoplist.enum';

export const PANTRY_MOCK = {
  SERVICE: {
    createPantryBody: {
      name: 'Pantry Name',
    },

    updatePantryBody: {
      id: 'id',
      name: 'Pantry',
      items: [
        {
          id: 'id',
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
          state: ITEM_STATE.IN_PANTRY,
        },
      ],
    },

    updatePantryBodyWithInCartMock: {
      id: 'id',
      items: [
        {
          id: 'id',
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
          state: ITEM_STATE.IN_CART,
        },
        {
          id: 'id',
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
          state: ITEM_STATE.IN_PANTRY,
        },
      ],
    },

    pantryId: 'id',

    pagination: {
      limit: 10,
      page: 1,
    },

    createPantryResponse: {
      id: 'id',
      name: 'Pantry Name',
    },

    findAllResponse: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Pantry First',
        },
      ],
      totalCount: 10,
    },

    updatePantryResponse: {
      id: 'id',
      name: 'Pantry name',
      items: [
        {
          id: 'id',
          name: 'Product name',
          productId: 'productId',
          portion: 100,
          portionType: PORTION_TYPE.GRAMS,
          state: ITEM_STATE.IN_PANTRY,
        },
      ],
    },
  },
  REPOSITORY: {
    create: {
      id: 'id',
      name: 'Pantry name',
    },

    update: {
      id: 'id',
      name: 'Pantry name',
      pantry_items: [
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
      name: 'Pantry name',
    },

    findAll: {
      data: [
        {
          id: '01ce2a72-2c23-4ffb-9f09-08edf0fabfa9',
          name: 'Pantry First',
        },
      ],
      totalCount: 10,
    },
  },
};
