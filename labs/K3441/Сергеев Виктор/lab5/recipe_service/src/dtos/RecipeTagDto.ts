import { Type } from "class-transformer";
import { IsDefined, IsInt, IsPositive } from "class-validator";
import { RecipeResponseDto } from "./RecipeDto";
import { TagResponseDto } from "./TagDto";

export class RecipeTagIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly recipetag_id: number;
}

export class RecipeTagForeignKeysDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly recipe_id: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly tag_id: number;
}

export class RecipeTagCreateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly tag_id: number
}

export class RecipeTagUpdateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly tag_id: number
}

export class RecipeTagResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number
    
    @IsDefined()
    public readonly recipe: RecipeResponseDto

    @IsDefined()
    public readonly tag: TagResponseDto
}