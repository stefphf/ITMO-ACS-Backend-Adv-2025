import { Type } from "class-transformer";
import { IsDefined, IsInt, IsPositive, ValidateIf } from "class-validator";

export class LikeIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly like_id: number;
}

export class LikeForeignKeysDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly recipe_id: number;
    
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly user_id: number;
}

export class LikeCreateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly user_id: number;
}

export class LikeUpdateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    @ValidateIf((object, value) => value)
    public readonly recipe_id: number;
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    @ValidateIf((object, value) => value)
    public readonly user_id: number;
}

export class LikeResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly user_id: number;
}