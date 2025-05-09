import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { Request } from '../../common/types/http.type';
import { ShoplistService } from './shoplist.service';
import { ShoplistControllerNamespace } from './shoplist.type';
import { shoplistValidator } from './shoplist.validator';
import CreateShoplistBody = ShoplistControllerNamespace.CreateShoplistBody;
import UpdateShoplistBody = ShoplistControllerNamespace.UpdateShoplistBody;
import FindAllQuery = ShoplistControllerNamespace.FindAllQuery;
import FindOneParam = ShoplistControllerNamespace.FindOneParam;

@UseGuards(JwtAuthGuard)
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

  @Put()
  @Roles(RESOURCES.SHOPLIST, ACTIONS.UPDATE)
  async update(
    @Body(new ZodValidationPipe(shoplistValidator.update))
    { items, name }: UpdateShoplistBody,
    @Req() req: Request,
  ) {
    return this.shoplistService.update(
      { items, name },
      req.currentUser.pantryId,
    );
  }
}
