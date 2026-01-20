import { User } from "../models/User";
import { UserResponseDto } from "../dtos/UserDto";
import { DeepPartial } from "typeorm";

export const toUserResponseDto = (
    entity: DeepPartial<User>
): UserResponseDto => {
    const dto = {
        id: entity.id,
        username: entity.username,
        avatar_url: entity.avatar_url ?? null,
        bio: entity.bio ?? null,
        created_at: entity.created_at
    }
    return dto as UserResponseDto;
}
