import { Module } from '@nestjs/common';
import { ItemTransactionService } from '../item-transaction/item-transaction.service';
import { ItemTransactionRepository } from './item-transaction.repository';

@Module({
  providers: [ItemTransactionService, ItemTransactionRepository],
  exports: [ItemTransactionService],
})
export class ItemTransactionModule {}
