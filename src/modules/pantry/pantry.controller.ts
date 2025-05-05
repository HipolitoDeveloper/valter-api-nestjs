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
import { PantryService } from './pantry.service';
import { PantryControllerNamespace } from './pantry.type';
import { pantryValidator } from './pantry.validator';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;
import UpdatePantryBody = PantryControllerNamespace.UpdatePantryBody;
import FindAllQuery = PantryControllerNamespace.FindAllQuery;
import FindOneParam = PantryControllerNamespace.FindOneParam;

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
  async update(@Body() pantry: UpdatePantryBody) {
    return this.pantryService.update(pantry);
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
