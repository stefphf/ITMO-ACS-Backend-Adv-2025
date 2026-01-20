import { Type } from "class-transformer";
import {
    IsDate,
    IsDefined,
    IsInt,
    IsPositive,
    IsString,
    IsUrl,
    Length,
    Max,
    Min,
    ValidateIf
} from "class-validator"

export class RecipeIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    recipe_id: number;
}

export class RecipeCreateDto {
    @IsDefined()
    @IsString()
    @Length(0, 100)
    public readonly title: string

    @IsDefined()
    @IsString()
    @Length(0, 800)
    public readonly description: string

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly cooking_time: number

    @IsDefined()
    @IsInt()
    @Max(5)
    @Min(1)
    public readonly difficulty: number

    @IsDefined()
    @IsUrl()
    public readonly image_url: string

    @IsString()
    @IsUrl()
    @ValidateIf((object, value) => (value))
    public readonly video_url: string | null

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly author_id: number
}

export class RecipeUpdateDto {
    @IsDefined()
    @IsString()
    @Length(0, 800)
    @ValidateIf((object, value) => (value))
    public readonly description: string | null

    @IsDefined()
    @IsInt()
    @IsPositive()
    @ValidateIf((object, value) => (value))
    public readonly cooking_time: number | null

    @IsDefined()
    @IsInt()
    @Max(5)
    @Min(1)
    @ValidateIf((object, value) => (value))
    public readonly difficulty: number | null

    @IsDefined()
    @IsUrl()
    @ValidateIf((object, value) => (value))
    public readonly image_url: string | null

    @IsString()
    @IsUrl()
    @ValidateIf((object, value) => (value))
    public readonly video_url: string | null
}

export class RecipeResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number

    @IsDefined()
    @IsString()
    @Length(0, 100)
    public readonly title: string

    @IsDefined()
    @IsString()
    @Length(0, 800)
    public readonly description: string

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly cooking_time: number

    @IsDefined()
    @IsInt()
    @Max(5)
    @Min(1)
    public readonly difficulty: number

    @IsDefined()
    @IsUrl()
    public readonly image_url: string

    @IsUrl()
    @ValidateIf((object, value) => (value !== null))
    public readonly video_url: string | null

    @IsDefined()
    @IsDate()
    public readonly created_at: Date;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly author_id: number
}
