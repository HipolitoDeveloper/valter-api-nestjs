import { Module } from '@nestjs/common';
import { ShoplistRepository } from './shoplist.repository';
import { ShoplistService } from './shoplist.service';
import { ShoplistController } from './shoplist.controller';

@Module({
  controllers: [ShoplistController],
  providers: [ShoplistService, ShoplistRepository],
})
export class ShoplistModule {}
