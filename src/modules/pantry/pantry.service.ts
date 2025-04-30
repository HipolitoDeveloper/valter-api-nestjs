import { Injectable } from '@nestjs/common';
import { ERRORS } from '../../common/enum';
import { ErrorException } from '../../common/exceptions/error.exception';
import { PantryRepository } from './pantry.repository';
import {
  PantryControllerNamespace,
  PantryRepositoryNamespace,
  PantryServiceNamespace,
} from './pantry.type';
import CreatePantryBody = PantryControllerNamespace.CreatePantryBody;
import Pantry = PantryRepositoryNamespace.Pantry;

@Injectable()
export class PantryService {
  constructor(private pantryRepository: PantryRepository) {}

  async create(
    pantry: CreatePantryBody,
  ): Promise<PantryServiceNamespace.CreateResponse> {
    let createdPantry: Pantry;
    try {
      createdPantry = await this.pantryRepository.create({
        name: pantry.name,
      });
    } catch {
      throw new ErrorException(ERRORS.CREATE_ENTITY_ERROR);
    }

    return {
      name: createdPantry.name,
    };
  }
}
