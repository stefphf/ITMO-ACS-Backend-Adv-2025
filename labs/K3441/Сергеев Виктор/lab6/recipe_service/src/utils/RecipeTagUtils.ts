import { DeepPartial } from "typeorm";
import { RecipeTag } from "../models/RecipeTag";
import { RecipeTagCreateDto, RecipeTagResponseDto, RecipeTagUpdateDto } from "../dtos/RecipeTagDto";
import { RecipeResponseDto } from "../dtos/RecipeDto";
import { TagResponseDto } from "../dtos/TagDto";

export const toRecipeTagCreateEntity = (
    dto: RecipeTagCreateDto
): RecipeTag => {
    const entity = {
        recipe: {
            id: dto.recipe_id
        },
        tag: {
            id: dto.tag_id
        }
    };

    return entity as RecipeTag
}

export const toRecipeTagUpdateEntity = (
    dto: RecipeTagUpdateDto
): RecipeTag => {
    const entity = {
        recipe: {
            id: dto.recipe_id
        },
        tag: {
            id: dto.tag_id
        }
    };

    return entity as RecipeTag;
}

export const toRecipeTagResponseDto = (
    entity: DeepPartial<RecipeTag>
): RecipeTagResponseDto => {
    const dto = {
        id: entity.id,
        recipe: entity.recipe as RecipeResponseDto,
        tag: entity.tag as TagResponseDto
    };

    return dto as RecipeTagResponseDto;
}