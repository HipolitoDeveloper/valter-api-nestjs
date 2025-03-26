import { SetMetadata } from '@nestjs/common';

export const Roles = (resource: string, action: string | string[]) =>
  SetMetadata('roles', { resource, action });
