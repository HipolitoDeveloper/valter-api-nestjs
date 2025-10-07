import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { Request } from '../../common/types/http.type';
import { notificationValidator } from './notification.validator';
import { NotificationService } from './notification.service';
import {
  Body,
  Controller,
  Get,
  Put,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { Roles } from '../../common/decorators/roles.decorator';
import {
  NotificationControllerNamespace,
  NotificationServiceNamespace,
} from './notification.type';
import FindAllQuery = NotificationControllerNamespace.FindAllQuery;
import UpdateNotificationDetailsQuery = NotificationControllerNamespace.UpdateNotificationDetailsQuery;
import HandleReadQuery = NotificationControllerNamespace.HandleReadQuery;

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('')
  @Roles(RESOURCES.NOTIFICATION, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(notificationValidator.findAll))
  async findAll(
    @Query(new ZodValidationPipe(notificationValidator.findAll))
    { limit, page }: FindAllQuery,
  ): Promise<NotificationServiceNamespace.FindAllResponse> {
    return this.notificationService.findAll({ limit, page });
  }

  @Put('details')
  @Roles(RESOURCES.NOTIFICATION, ACTIONS.UPDATE)
  async updateNotificationDetails(
    @Body(
      new ZodValidationPipe(notificationValidator.updateNotificationDetails),
    )
    data: UpdateNotificationDetailsQuery,
    @Req() req: Request,
  ): Promise<NotificationServiceNamespace.UpdateResponse> {
    return this.notificationService.updateNotificationDetails(
      data,
      req.currentUser.pantryId,
      req.currentUser.id,
    );
  }

  @Put('read')
  @Roles(RESOURCES.NOTIFICATION, ACTIONS.UPDATE)
  async handleRead(
    @Body(new ZodValidationPipe(notificationValidator.handleRead))
    data: HandleReadQuery,
  ): Promise<NotificationServiceNamespace.UpdateResponse> {
    return this.notificationService.handleRead(data);
  }
}
