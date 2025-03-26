import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export const createUser = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  await prisma.user.upsert({
    where: {
      id: generateUuid(),
    },
    update: {},
    create: {
      email: 'admin@valter.com',
      password: '',
      surname: 'Valter',
      firstname: 'Admin',
      birthday: new Date('21/11/20001'),
      pantry: {
        create: {
          name: 'Admin pantry',
        },
      },
    },
  });
};
