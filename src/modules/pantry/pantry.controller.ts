import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { ACTIONS, RESOURCES } from '../../common/permission/permission.enum';
import { ZodValidationPipe } from '../../common/pipe/zod-validation.pipe';
import { PantryService } from './pantry.service';
import { PantryControllerNamespace } from './pantry.type';
import { pantryValidator } from './pantry.validator';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;

@Controller('pantry')
export class PantryController {
  constructor(private readonly pantryService: PantryService) {}

  @Post('')
  @Roles(RESOURCES.PANTRY, ACTIONS.CREATE)
  @UsePipes(new ZodValidationPipe(pantryValidator.createPantry))
  async create(@Body() pantry: CreatePantryBody) {
    return this.pantryService.create(pantry);
  }
}
