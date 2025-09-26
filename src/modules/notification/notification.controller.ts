import { Controller, Get, Query, UseGuards, UsePipes } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { productValidator } from '../product/product.validator';
import { NotificationService } from './notification.service';
import { NotificationControllerNamespace } from './notification.type';
import FindAllQuery = NotificationControllerNamespace.FindAllQuery;

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  @Roles(RESOURCES.PRODUCT, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(productValidator.findAll))
  async findAll(
    @Query(new ZodValidationPipe(productValidator.findAll))
    { limit, page }: FindAllQuery,
  ) {
    return this.notificationService.findAll({ limit, page });
  }
}
