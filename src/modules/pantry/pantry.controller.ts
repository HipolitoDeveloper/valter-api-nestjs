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
import { PantryService } from './pantry.service';
import { PantryControllerNamespace } from './pantry.type';
import { pantryValidator } from './pantry.validator';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;
import UpdatePantryBody = PantryControllerNamespace.UpdatePantryBody;
import FindAllQuery = PantryControllerNamespace.FindAllQuery;
import FindOneParam = PantryControllerNamespace.FindOneParam;

@UseGuards(JwtAuthGuard)
@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post('')
  @Roles(RESOURCES.PANTRY, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(pantryValidator.create))
  async create(@Body() pantry: CreatePantryBody) {
    return this.pantryService.create(pantry);
  }

  @Put('')
  @Roles(RESOURCES.PANTRY, ACTIONS.UPDATE)
  @UsePipes(new ZodValidationPipe(pantryValidator.update))
  async update(@Body() pantry: UpdatePantryBody, @Req() req: Request) {
    return this.pantryService.update(
      pantry,
      req.currentUser.pantryId,
      undefined,
      req.currentUser.id,
    );
  }

  @Get('')
  @Roles(RESOURCES.PANTRY, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(pantryValidator.findAll))
  async findAll(
    @Query(new ZodValidationPipe(pantryValidator.findAll))
    { limit, page }: FindAllQuery,
  ) {
    return this.pantryService.findAll({ limit, page });
  }

  @Get(':id')
  @Roles(RESOURCES.PANTRY, ACTIONS.FIND_ALL)
  async findOne(
    @Param(new ZodValidationPipe(pantryValidator.findOne)) { id }: FindOneParam,
  ) {
    return this.pantryService.findOne(id);
  }
}
