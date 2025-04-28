import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PROFILES } from '../../src/common/enum';

export const createProfile = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  const actions = await prisma.action.findMany({
    select: {
      id: true,
    },
  });

  await prisma.profile.upsert({
    where: {
      name: PROFILES.ADMINISTRATOR,
    },
    update: {
      name: PROFILES.ADMINISTRATOR,
      profile_actions: {
        deleteMany: {},

        create: actions.map((action) => ({
          action: {
            connect: { id: action.id },
          },
        })),
      },
    },
    create: {
      id: generateUuid(),
      name: PROFILES.ADMINISTRATOR,
      profile_actions: {
        create: actions.map((action) => ({
          action: {
            connect: { id: action.id },
          },
        })),
      },
    },
  });

  await prisma.profile.upsert({
    where: {
      name: PROFILES.USER,
    },
    update: {
      name: PROFILES.USER,
    },
    create: {
      id: generateUuid(),
      name: PROFILES.USER,
    },
  });
};
