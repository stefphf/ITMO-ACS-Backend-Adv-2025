import { DeepPartial } from "typeorm";
import { Ingredient } from "../models/Ingredient";
import { IngredientCreateDto, IngredientResponseDto } from "../dtos/IngredientDto";

export const toIngredientCreateEntity = (
    dto: IngredientCreateDto
): Ingredient => {
    const entity = {
        name: dto.name
    }
    return entity as Ingredient;
}

export const toIngredientResponseDto = (
    entity: DeepPartial<Ingredient>
): IngredientResponseDto => {
    const dto = {
        id: entity.id,
        name: entity.name
    }

    return dto as IngredientResponseDto;
}