import { forwardRef, Module } from '@nestjs/common';
import { ItemTransactionModule } from '../item-transaction/item-transaction.module';
import { ShoplistModule } from '../shoplist/shoplist.module';
import { PantryController } from './pantry.controller';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';

@Module({
  imports: [
    forwardRef(() => ShoplistModule),
    forwardRef(() => ItemTransactionModule),
  ],
  controllers: [PantryController],
  providers: [PantryService, PantryRepository],
  exports: [PantryService],
})
export class PantryModule {}
