import { DeepPartial } from "typeorm";
import { RecipeIngredient } from "../models/RecipeIngredient";
import { RecipeIngredientCreateDto, RecipeIngredientResponseDto, RecipeIngredientUpdateDto } from "../dtos/RecipeIngredientDto";
import { IngredientResponseDto } from "../dtos/IngredientDto";
import { RecipeResponseDto } from "../dtos/RecipeDto";

export const toRecipeIngredientResponseDto = (
    entity: DeepPartial<RecipeIngredient>
): RecipeIngredientResponseDto => {
    const dto = {
        id: entity.id,
        recipe: entity.recipe as RecipeResponseDto,
        ingredient: entity.ingredient as IngredientResponseDto,
        amount: entity.amount,
        unit: entity.unit
    }
    return dto as RecipeIngredientResponseDto;
}

export const toRecipeIngredientCreateEntity = (
    dto: RecipeIngredientCreateDto
): RecipeIngredient => {
    const entity = {
        recipe: {
            id: dto.recipe_id
        },
        ingredient: {
            id: dto.ingredient_id
        },
        amount: dto.amount,
        unit: dto.unit
    };

    return entity as RecipeIngredient;
}

export const toRecipeIngredientUpdateEntity = (
    dto: RecipeIngredientUpdateDto
): RecipeIngredient => {
    const entity = {
        recipe: {
            id: dto.recipe_id
        },
        ingredient: {
            id: dto.ingredient_id
        },
        amount: dto.amount,
        unit: dto.unit
    };

    return entity as RecipeIngredient;
}