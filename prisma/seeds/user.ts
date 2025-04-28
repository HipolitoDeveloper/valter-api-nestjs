import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PROFILES } from '../../src/common/enum';
import { RESOURCES } from '../../src/common/permission/permission.enum';

export const createUser = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  const profile = await prisma.profile.findFirstOrThrow({
    select: {
      id: true,
    },
    where: {
      name: PROFILES.ADMINISTRATOR,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'admin@valter.com',
    },
    update: {},
    create: {
      id: generateUuid(),
      email: 'admin@valter.com',
      password: '$2b$10$99YOqVrCadRM5hE/boZoIOMs1bzrh59pzVEDLPFRdZzyknVGiP/2G',
      surname: 'Valter',
      firstname: 'Admin',
      birthday: new Date('2001-11-21'),
      pantry: {
        create: {
          name: 'Admin pantry',
        },
      },
      profile: {
        connect: {
          id: profile.id,
        },
      },
    },
  });
};
