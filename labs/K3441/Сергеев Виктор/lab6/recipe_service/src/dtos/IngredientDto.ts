import { Type } from "class-transformer";
import { IsDefined, IsInt, IsPositive, IsString, Length } from "class-validator";

export class IngredientIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly ingredient_id: number
}

export class IngredientCreateDto {
    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string;
}

export class IngredientUpdateDto {
    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string
}

export class IngredientResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number;

    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string
}