import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RESOURCES } from '../../src/common/permission/permission.enum';

export const createResource = async (prisma: PrismaClient) => {
  const generateUuid = uuidv4 as () => string;

  await prisma.resources.upsert({
    where: {
      name: RESOURCES.USER,
    },
    update: {},
    create: {
      id: generateUuid(),
      name: RESOURCES.USER,
    },
  });
};
