import { Module } from '@nestjs/common';
import { ItemTransactionRepository } from '../item-transaction/item-transaction.repository';
import { ItemTransactionService } from '../item-transaction/item-transaction.service';
import { PantryRepository } from '../pantry/pantry.repository';
import { PantryService } from '../pantry/pantry.service';
import { ShoplistRepository } from '../shoplist/shoplist.repository';
import { ShoplistService } from '../shoplist/shoplist.service';
import { NotificationRepository } from './notification.repository';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    PantryService,
    PantryRepository,
    ShoplistService,
    ShoplistRepository,
    ItemTransactionService,
    ItemTransactionRepository,
  ],
})
export class NotificationModule {}
