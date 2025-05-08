import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { ShoplistService } from './shoplist.service';
import { ShoplistControllerNamespace } from './shoplist.type';
import { shoplistValidator } from './shoplist.validator';
import CreateShoplistBody = ShoplistControllerNamespace.CreateShoplistBody;
import UpdateShoplistBody = ShoplistControllerNamespace.UpdateShoplistBody;
import FindAllQuery = ShoplistControllerNamespace.FindAllQuery;
import FindOneParam = ShoplistControllerNamespace.FindOneParam;
import ShoplistIdParam = ShoplistControllerNamespace.ShoplistIdParam;

@Controller('shoplist')
export class ShoplistController {
  constructor(private readonly shoplistService: ShoplistService) {}

  @Post('')
  @Roles(RESOURCES.SHOPLIST, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(shoplistValidator.create))
  async create(@Body() shoplist: CreateShoplistBody) {
    return this.shoplistService.create(shoplist);
  }

  @Get('')
  @Roles(RESOURCES.SHOPLIST, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(shoplistValidator.findAll))
  async findAll(
    @Query(new ZodValidationPipe(shoplistValidator.findAll))
    { limit, page }: FindAllQuery,
  ) {
    return this.shoplistService.findAll({ limit, page });
  }

  @Get(':id')
  @Roles(RESOURCES.SHOPLIST, ACTIONS.FIND_ALL)
  async findOne(
    @Param(new ZodValidationPipe(shoplistValidator.findOne))
    { id }: FindOneParam,
  ) {
    return this.shoplistService.findOne(id);
  }

  @Put(':id')
  @Roles(RESOURCES.SHOPLIST, ACTIONS.UPDATE)
  async update(
    @Param(new ZodValidationPipe(shoplistValidator.shoplistId))
    { id }: ShoplistIdParam,
    @Body(new ZodValidationPipe(shoplistValidator.update))
    { items, name }: UpdateShoplistBody,
  ) {
    return this.shoplistService.update({ id, items, name });
  }
}
