import { PrismaClient } from '@prisma/client';
import { createActions } from './action';
import { createProfile } from './profile';
import { createResource } from './resource';
import { createUser } from './user';

const prisma = new PrismaClient();

async function main() {}

main()
  .then(async () => {
    await createResource(prisma);
    await createActions(prisma);
    await createProfile(prisma);
    await createUser(prisma);

    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
