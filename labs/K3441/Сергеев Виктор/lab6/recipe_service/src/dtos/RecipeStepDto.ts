import { Type } from "class-transformer";
import {
    IsDefined,
    IsInt,
    IsPositive,
    IsString,
    IsUrl,
    Length
} from "class-validator";
import { RecipeResponseDto } from "./RecipeDto";

export class RecipeStepIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    recipestep_id: number
}

export class RecipeStepCreateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly step_number: number

    @IsDefined()
    @IsString()
    @Length(1, 300)
    public readonly instruction: string;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;
}

export class RecipeStepUpdateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly step_number: number

    @IsDefined()
    @IsString()
    @Length(1, 300)
    public readonly instruction: string;
}

export class RecipeStepResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly step_number: number

    @IsDefined()
    @IsString()
    @Length(1, 300)
    public readonly instruction: string;

    @IsDefined()
    public readonly recipe: RecipeResponseDto;
}