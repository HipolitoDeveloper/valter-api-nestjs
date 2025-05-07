import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { ShoplistModule } from './modules/shoplist/shoplist.module';
import { UserModule } from './modules/user/user.module';
import { PantryModule } from './modules/pantry/pantry.module';

@Module({
  imports: [UserModule, AuthModule, PantryModule, ShoplistModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
