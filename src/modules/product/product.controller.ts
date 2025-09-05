import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req, UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { Request } from '../../common/types/http.type';
import { ProductService } from './product.service';
import { ProductControllerNamespace } from './product.type';
import { productValidator } from './product.validator';
import CreateProductBody = ProductControllerNamespace.CreateProductBody;
import UpdateProductBody = ProductControllerNamespace.UpdateProductBody;
import FindAllQuery = ProductControllerNamespace.FindAllQuery;
import FindOneParam = ProductControllerNamespace.FindOneParam;

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('')
  @Roles(RESOURCES.PRODUCT, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(productValidator.create))
  async create(@Body() product: CreateProductBody) {
    return this.productService.create(product);
  }

  @Put('')
  @Roles(RESOURCES.PRODUCT, ACTIONS.UPDATE)
  @UsePipes(new ZodValidationPipe(productValidator.update))
  async update(@Body() product: UpdateProductBody) {
    return this.productService.update(product);
  }

  @Get('')
  @Roles(RESOURCES.PRODUCT, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(productValidator.findAll))
  async findAll(
    @Query(new ZodValidationPipe(productValidator.findAll))
    { limit, page, productName }: FindAllQuery,
  ) {
    return this.productService.findAll({ limit, page, productName });
  }

  @Get(':id')
  @Roles(RESOURCES.PRODUCT, ACTIONS.FIND_ALL)
  async findOne(
    @Param(new ZodValidationPipe(productValidator.findOne))
    { id }: FindOneParam,
  ) {
    return this.productService.findOne(id);
  }

  @Get('recommended')
  @Roles(RESOURCES.PRODUCT, ACTIONS.FIND_ALL_RECOMMENDED_PRODUCTS)
  async findAllRecommendedProducts(@Req() req: Request) {
    return this.productService.findAllRecommendedProducts({
      userId: req.currentUser.id,
      pantryId: req.currentUser.pantryId,
    });
  }
}
