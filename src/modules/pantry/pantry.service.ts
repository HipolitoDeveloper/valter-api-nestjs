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
import UpdatePantryBody = PantryControllerNamespace.UpdatePantryBody;
import FindAllQuery = PantryControllerNamespace.FindAllQuery;

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

  async update(
    pantry: UpdatePantryBody,
  ): Promise<PantryServiceNamespace.UpdateResponse> {
    let updatedPantry: Pantry;
    try {
      updatedPantry = await this.pantryRepository.update(pantry);
    } catch {
      throw new ErrorException(ERRORS.UPDATE_ENTITY_ERROR);
    }

    return {
      id: updatedPantry.id,
      name: updatedPantry.name,
    };
  }

  async findOne(
    pantryId: string,
  ): Promise<PantryServiceNamespace.FindOneResponse> {
    let pantry: Pantry;
    try {
      pantry = await this.pantryRepository.findOne(pantryId);
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    if (!pantry) {
      throw new ErrorException(ERRORS.NOT_FOUND_ENTITY);
    }

    return {
      id: pantry.id,
      name: pantry.name,
    };
  }

  async findAll({
    limit,
    page,
  }: FindAllQuery): Promise<PantryServiceNamespace.FindAllResponse> {
    const offset = limit && page ? limit * (page - 1) : undefined;
    let pantries: Pantry[] = [];
    try {
      pantries = await this.pantryRepository.findAll({ limit, offset });
    } catch {
      throw new ErrorException(ERRORS.DATABASE_ERROR);
    }

    return pantries.map((pantry) => ({
      id: pantry.id,
      name: pantry.name,
    }));
  }
}
