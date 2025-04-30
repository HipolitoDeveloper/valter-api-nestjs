import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  ACTIONS,
  RESOURCES,
} from '../../src/common/permission/permission.enum';

const createActionsFromUserResource = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  const userResource = await prisma.resources.findFirstOrThrow({
    select: {
      id: true,
    },
    where: {
      name: RESOURCES.USER,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: userResource?.id,
        name: ACTIONS.CREATE,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: userResource?.id,
      name: ACTIONS.CREATE,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: userResource?.id,
        name: ACTIONS.UPDATE,
      },
    },
    update: {},
    create: {
      resource_id: userResource?.id,
      name: ACTIONS.UPDATE,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: userResource?.id,
        name: ACTIONS.FIND_ALL,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: userResource?.id,
      name: ACTIONS.FIND_ALL,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: userResource?.id,
        name: ACTIONS.FIND_ONE,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: userResource?.id,
      name: ACTIONS.FIND_ONE,
    },
  });
};

const createActionsFromPantryResource = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  const pantryResource = await prisma.resources.findFirstOrThrow({
    select: {
      id: true,
    },
    where: {
      name: RESOURCES.PANTRY,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: pantryResource?.id,
        name: ACTIONS.CREATE,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: pantryResource?.id,
      name: ACTIONS.CREATE,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: pantryResource?.id,
        name: ACTIONS.UPDATE,
      },
    },
    update: {},
    create: {
      resource_id: pantryResource?.id,
      name: ACTIONS.UPDATE,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: pantryResource?.id,
        name: ACTIONS.FIND_ALL,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: pantryResource?.id,
      name: ACTIONS.FIND_ALL,
    },
  });

  await prisma.action.upsert({
    where: {
      name_resource_id: {
        resource_id: pantryResource?.id,
        name: ACTIONS.FIND_ONE,
      },
    },
    update: {},
    create: {
      id: generateUuid(),
      resource_id: pantryResource?.id,
      name: ACTIONS.FIND_ONE,
    },
  });
};

export const createActions = async (prisma: PrismaClient) => {
  await createActionsFromUserResource(prisma);
  await createActionsFromPantryResource(prisma);
};
