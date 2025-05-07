import { Module } from '@nestjs/common';
import { ShoplistRepository } from '../shoplist/shoplist.repository';
import { ShoplistService } from '../shoplist/shoplist.service';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';
import { PantryController } from './pantry.controller';

@Module({
  controllers: [PantryController],
  providers: [
    PantryService,
    PantryRepository,
    ShoplistService,
    ShoplistRepository,
  ],
})
export class PantryModule {}
