import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { UserControllerNamespace } from './user.type';
import { userValidator } from './user.validator';
import { JwtAuthGuard } from '../../common/guards/auth-jwt.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Request } from '../../common/types/http.type';
import CreateUserBody = UserControllerNamespace.CreateUserBody;
import UpdateUserBody = UserControllerNamespace.UpdateUserBody;

@Controller('user')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(RESOURCES.USER, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(userValidator.createUser))
  async create(@Req() request: Request, @Body() user: CreateUserBody) {
    const createdUser = await this.userService.create(
      user,
      request.currentUser,
    );
    return createdUser;
  }

  @Get(':userId')
  @Roles(RESOURCES.USER, ACTIONS.FIND_ONE)
  async findOne(@Param('userId') userId: string) {
    const user = await this.userService.findOneById(userId);
    return user;
  }

  @Put()
  @Roles(RESOURCES.USER, ACTIONS.UPDATE)
  @UsePipes(new ZodValidationPipe(userValidator.updateUser))
  update(@Body() user: UpdateUserBody) {
    return this.userService.update(user);
  }
}
