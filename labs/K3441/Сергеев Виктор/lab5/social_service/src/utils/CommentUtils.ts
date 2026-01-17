import { DeepPartial } from "typeorm"
import { Comment } from "../models/Comment"
import { CommentCreateDto, CommentResponseDto, CommentUpdateDto } from "../dtos/CommentDto"

export const toCommentCreateEntity = (
    dto: CommentCreateDto
): Comment => {
    const entity = {
        recipe_id: dto.recipe_id,
        user_id: dto.user_id,
        comment: dto.comment
    }

    return entity as Comment;
}

export const toCommentUpdateEntity = (
    dto: CommentUpdateDto
): Comment => {
    const entity = {
        recipe_id: dto.recipe_id,
        user_id: dto.user_id,
        comment: dto.comment
    }

    return entity as Comment;
}

export const toCommentResponseDto = (
    entity: DeepPartial<Comment>
): CommentResponseDto => {
    const dto = {
        id: entity.id,
        recipe_id: entity.recipe_id,
        user_id: entity.user_id,
        comment: entity.comment,
        created_at: entity.created_at
    }

    return dto as CommentResponseDto
}