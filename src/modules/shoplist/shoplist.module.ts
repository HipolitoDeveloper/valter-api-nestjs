import { forwardRef, Module } from '@nestjs/common';
import { ItemTransactionModule } from '../item-transaction/item-transaction.module';
import { PantryModule } from '../pantry/pantry.module';
import { ShoplistController } from './shoplist.controller';
import { ShoplistRepository } from './shoplist.repository';
import { ShoplistService } from './shoplist.service';

@Module({
  imports: [
    forwardRef(() => PantryModule),
    forwardRef(() => ItemTransactionModule),
  ],
  controllers: [ShoplistController],
  providers: [ShoplistService, ShoplistRepository],
  exports: [ShoplistService],
})
export class ShoplistModule {}
