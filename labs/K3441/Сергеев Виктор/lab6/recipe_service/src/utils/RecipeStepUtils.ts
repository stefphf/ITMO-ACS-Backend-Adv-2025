import { DeepPartial } from "typeorm"
import { RecipeStep } from "../models/RecipeStep"
import { RecipeStepCreateDto, RecipeStepResponseDto } from "../dtos/RecipeStepDto"
import { RecipeResponseDto } from "../dtos/RecipeDto"

export const toRecipeStepResponseDto = (
    entity: DeepPartial<RecipeStep>
): RecipeStepResponseDto => {
    const dto = {
        id: entity.id,
        step_number: entity.step_number,
        instruction: entity.instruction,
        recipe: entity.recipe as RecipeResponseDto
    }
    return dto as RecipeStepResponseDto;
}

export const toRecipeStepCreateEntity = (
    dto: RecipeStepCreateDto
): RecipeStep => {
    const entity = {
        step_number: dto.step_number,
        instruction: dto.instruction,
        recipe: {
            id: dto.recipe_id
        }
    }

    return entity as RecipeStep;
}