import { Module } from '@nestjs/common';
import { ItemTransactionRepository } from '../../item-transaction/item-transaction.repository';
import { ItemTransactionService } from '../../item-transaction/item-transaction.service';
import { PantryRepository } from '../../pantry/pantry.repository';
import { PantryService } from '../../pantry/pantry.service';
import { ShoplistRepository } from '../../shoplist/shoplist.repository';
import { ShoplistService } from '../../shoplist/shoplist.service';
import { NotificationModule } from '../notification.module';
import { NotificationRepository } from '../notification.repository';
import { NotificationService } from '../notification.service';
import { NotificationExpiresConfig } from './notification-expires.config';
import { NotificationExpiresService } from './notification-expires.service';

@Module({
  providers: [
    NotificationExpiresService,
    NotificationExpiresConfig,
    NotificationService,
    NotificationRepository,
    NotificationModule,
    PantryService,
    PantryRepository,
    ShoplistService,
    ShoplistRepository,
    ItemTransactionService,
    ItemTransactionRepository,
  ],
  exports: [NotificationExpiresService],
})
export class NotificationExpiresModule {}
