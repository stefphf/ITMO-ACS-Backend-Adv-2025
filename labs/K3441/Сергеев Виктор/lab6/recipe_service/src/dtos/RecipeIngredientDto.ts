import { Type } from "class-transformer";
import { IsDefined, IsInt, IsPositive, IsString, Length } from "class-validator";
import { RecipeResponseDto } from "./RecipeDto";
import { IngredientResponseDto } from "./IngredientDto";

export class RecipeIngredientIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly recipeingredient_id: number;
}

export class RecipeIngredientForeignKeysDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly recipe_id: number;
    
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly ingredient_id: number;
}

export class RecipeIngredientCreateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly ingredient_id: number;
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly amount: number;
    
    @IsDefined()
    @IsString()
    @Length(1, 30)
    public readonly unit: string;
}

export class RecipeIngredientUpdateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly ingredient_id: number;
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly amount: number
    
    @IsDefined()
    @IsString()
    @Length(1, 30)
    public readonly unit: string;
}

export class RecipeIngredientResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number

    @IsDefined()
    public readonly recipe: RecipeResponseDto
    
    @IsDefined()
    public readonly ingredient: IngredientResponseDto;
    
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly amount: number
    
    @IsDefined()
    @IsString()
    @Length(1, 30)
    public readonly unit: string;
}