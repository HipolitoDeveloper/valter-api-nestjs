import { actionResourceGrouper } from '../../src/helper/action-resource.grouper';

export const USER_MOCK = {
  currentUser: {
    id: 4,
    pantryId: 'id',
    firstName: 'Gabriel',
    resources: {
      pantry: {
        findOne: true,
        create: true,
        update: true,
        findAll: true,
      },
      user: {
        create: true,
        findOne: true,
        update: true,
      },
    },
    profile: 'Administrator',
  },
  SERVICE: {
    userMock: {
      id: '20',
      password: '$2b$10$aHvJOmzUXE.l.UAoLhbRN.ilCE0wYnMEMsOlSRX3oLVqVGiYnQrMq',
      email: 'manchester@gmail.com',
      firstName: 'User manchester',
      surname: 'manchester apagar',
      birthday: new Date('2001-01-21 22:44:29.728 -0300'),
      pantryName: 'Pantry name',
    },
    findOneById: {
      id: '1',
      firstName: 'first_name',
      email: 'email@email.com',
    },
    update: {
      id: '1',
      firstName: 'first_name',
      email: 'email@email.com',
    },
  },
  REPOSITORY: {
    update: {
      id: 'id',
      password: '$2b$10$WsMZLw4maPlsCxD7n3znselE6KfNUozAhcVPAIjoX97yCQyg1zqMe',
      email: 'manchester@gmail.com',
      firstname: 'User manchester',
      surname: 'manchester apagar',
      pantry: {
        id: 'id',
        name: 'Pantry name',
      },
    },
    create: {
      id: 'id',
      password: '$2b$10$WsMZLw4maPlsCxD7n3znselE6KfNUozAhcVPAIjoX97yCQyg1zqMe',
      email: 'manchester@gmail.com',
      firstname: 'User manchester',
      surname: 'manchester apagar',
      pantry: {
        id: 'id',
        name: 'Pantry name',
      },
    },
    findAll: [
      {
        id: 'id',
        email: 'manchester@gmail.com',
        firstname: 'User manchester',
        surname: 'manchester apagar',
      },
    ],
    findById: {
      id: 'id',
      email: 'manchester@gmail.com',
      firstname: 'User manchester',
      surname: 'manchester apagar',
      pantry: {
        id: 'id',
        name: 'Pantry name',
      },
      profile: {
        profile_actions: [
          {
            action: {
              name: 'create',
              resource: {
                name: 'resource name',
              },
            },
          },
        ],
      },
    },
    findByEmail: {
      id: 'id',
      email: 'manchester@gmail.com',
      firstname: 'User manchester',
      surname: 'manchester apagar',
      pantry: {
        id: 'id',
        name: 'Pantry name',
      },
      password: '',
    },
  },
};
