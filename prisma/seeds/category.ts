import { PrismaClient } from '@prisma/client';

export const createCategory = async (prisma: PrismaClient) => {

  await prisma.category.upsert({
    where: {
      id: '600e6dde-79cc-40d8-9ac2-577e983a2bc7',
    },
    update: {},
    create: {
      id: '600e6dde-79cc-40d8-9ac2-577e983a2bc7',
      name: 'Teste',
    },
  });
};
