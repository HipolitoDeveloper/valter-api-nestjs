import { SetMetadata } from '@nestjs/common';
import keys from './keys';

export const CacheEntity = (cacheEntityKey: string) =>
  SetMetadata(keys.CACHE, cacheEntityKey);
