import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository],
})
export class ProductModule {}
