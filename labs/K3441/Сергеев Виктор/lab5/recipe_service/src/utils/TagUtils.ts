import { DeepPartial } from "typeorm";
import { Tag } from "../models/Tag";
import { TagCreateDto, TagResponseDto } from "../dtos/TagDto";

export const toTagCreateEntity = (
    dto: TagCreateDto
): Tag => {
    const entity = {
        name: dto.name
    };

    return entity as Tag;
}

export const toTagResponseDto = (
    entity: DeepPartial<Tag>
): TagResponseDto => {
    const dto = {
        id: entity.id,
        name: entity.name
    };

    return dto as TagResponseDto;
}