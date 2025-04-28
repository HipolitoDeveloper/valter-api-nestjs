import { Injectable } from '@nestjs/common';
import prisma from '../../../prisma/prisma';

@Injectable()
export class AuthRepository {
  upsertSession(userId: string, refreshToken: string) {
    return prisma.session.upsert({
      where: {
        user_id: userId,
      },
      create: {
        refresh_token: refreshToken,
        user: {
          connect: {
            id: userId,
          },
        },
      },
      update: {
        refresh_token: refreshToken,
      },
    });
  }

  async findByUserId(userId: string) {
    const sessionResult = await prisma.session.findFirstOrThrow({
      where: {
        user_id: userId,
      },
      select: {
        user: {
          select: {
            id: true,
            firstname: true,
            pantry_id: true,
            profile: {
              select: {
                name: true,
                profile_actions: {
                  select: {
                    action: {
                      select: {
                        name: true,
                        resource: {
                          select: {
                            name: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        refresh_token: true,
      },
    });

    return {
      userId: sessionResult.user.id,
      firstName: sessionResult.user.firstname,
      pantryId: sessionResult.user.pantry_id,
      refreshToken: sessionResult?.refresh_token,
      profile: sessionResult.user.profile,
    };
  }
}
