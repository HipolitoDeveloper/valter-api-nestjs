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
  @UsePipes(new ZodValidationPipe(pantryValidator.create))
  async update(@Body() pantry: UpdatePantryBody) {
    return this.pantryService.update(pantry);
  }

  @Get(':pantryId')
  @Roles(RESOURCES.PANTRY, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(pantryValidator.findAll))
  async findOne(@Param() pantryId: string) {
    return this.pantryService.findOne(pantryId);
  }

  @Get('')
  @Roles(RESOURCES.PANTRY, ACTIONS.FIND_ALL)
  @UsePipes(new ZodValidationPipe(pantryValidator.findAll))
  async findAll(@Query() { limit, page }: FindAllQuery) {
    return this.pantryService.findAll({ limit, page });
  }
}
