import { forwardRef, Module } from '@nestjs/common';
import { ShoplistModule } from '../shoplist/shoplist.module';
import { PantryController } from './pantry.controller';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';

@Module({
  imports: [forwardRef(() => ShoplistModule)],
  controllers: [PantryController],
  providers: [PantryService, PantryRepository],
  exports: [PantryService],
})
export class PantryModule {}
