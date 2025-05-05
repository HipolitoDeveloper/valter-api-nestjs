export const PANTRY_MOCK = {
  SERVICE: {
    createPantryBody: {
      name: 'Pantry Name',
    },

    updatePantryBody: {
      id: 'id',
      name: 'Pantry',
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
  },
  REPOSITORY: {
    create: {
      id: 'id',
      name: 'Pantry name',
    },

    update: {
      id: 'id',
      name: 'Pantry name',
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
