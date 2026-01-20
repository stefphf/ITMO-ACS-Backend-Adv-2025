import { DeepPartial } from "typeorm";
import { Recipe } from "../models/Recipe";
import { RecipeCreateDto, RecipeResponseDto } from "../dtos/RecipeDto";

export const toRecipeResponseDto = (
    entity: DeepPartial<Recipe>
): RecipeResponseDto => {
    const dto = {
        id: entity.id,
        title: entity.title,
        description: entity.description,
        cooking_time: entity.cooking_time,
        difficulty: entity.difficulty,
        image_url: entity.image_url,
        video_url: entity.video_url,
        created_at: entity.created_at,
        author_id: entity.author_id
    };

    return dto as RecipeResponseDto;
} 

export const toRecipeCreateEntity = (
    dto: RecipeCreateDto
): Recipe => {
    const entity = {
        title: dto.title,
        description: dto.description,
        cooking_time: dto.cooking_time,
        difficulty: dto.difficulty,
        image_url: dto.image_url,
        video_url: dto.video_url,
        author_id: dto.author_id
    };
    return entity as Recipe;
}