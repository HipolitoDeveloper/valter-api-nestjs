import { Module } from '@nestjs/common';
import { PantryRepository } from './pantry.repository';
import { PantryService } from './pantry.service';
import { PantryController } from './pantry.controller';

@Module({
  controllers: [PantryController],
  providers: [PantryService, PantryRepository],
})
export class PantryModule {}
