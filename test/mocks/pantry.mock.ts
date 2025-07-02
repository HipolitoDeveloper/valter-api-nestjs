import {
  ITEM_STATE,
  PORTION_TYPE,
} from '../../src/modules/shoplist/shoplist.enum';

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
          valid_until: '2023-10-01T00:00:00.000Z',

        },
      ],
    },

    findOne: {
      id: 'id',
      name: 'Pantry name',
      pantry_items: [
        {
          id: 'ee2e543b-854f-4be0-acde-e87b94d908b6',
          product: {
            id: '3124baa9-6d2d-4e98-a658-00aab292035f',
            name: 'Bteste',
          },
          portion: 100,
          portion_type: 'GRAMS',
          valid_until: '2023-10-01T00:00:00.000Z',
        },
        {
          id: '812ea3bf-99ba-4dc4-856a-0667c71e4073',
          product: {
            id: '7e7a25cd-7502-43f9-a086-1a2bcd68c365',
            name: 'Ateste',
          },
          portion: 100,
          portion_type: 'GRAMS',
          valid_until: '2023-10-01T00:00:00.000Z',
        },
      ],
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
