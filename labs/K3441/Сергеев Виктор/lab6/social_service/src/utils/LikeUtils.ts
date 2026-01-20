import { DeepPartial } from "typeorm";
import { Like } from "../models/Like";
import { LikeCreateDto, LikeResponseDto, LikeUpdateDto } from "../dtos/LikeDto";

export const toLikeCreateEntity = (
    dto: LikeCreateDto
): Like => {
    const entity = {
        recipe_id: dto.recipe_id,
        user_id: dto.user_id
    }
    return entity as Like
}

export const toLikeUpdateEntity = (
    dto: LikeUpdateDto
): Like => {
    const entity = {
        recipe_id: dto.recipe_id,
        user_id: dto.user_id
    }
    return entity as Like;
}

export const toLikeResponseDto = (
    entity: DeepPartial<Like>
): LikeResponseDto => {
    const dto = {
        id: entity.id,
        recipe_id: entity.recipe_id,
        user_id: entity.user_id
    }

    return dto as LikeResponseDto;
}