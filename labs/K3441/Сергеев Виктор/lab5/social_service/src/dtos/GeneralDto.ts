import { Type } from "class-transformer";
import { IsBoolean, IsDefined, IsInt, IsPositive, IsString, ValidateIf } from "class-validator";

export class ErrorDto {
    @IsDefined()
    @IsString()
    detail: string;
}

export class ExistResponseDto {
    @IsDefined()
    @IsBoolean()
    public readonly is: boolean;
}

export class DeleteResponseDto {
    @IsDefined()
    @IsString()
    public readonly success: boolean;
}

export class RecipeIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ValidateIf((object, value) => value)
    public readonly recipe_id: number;
}

export class UserIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ValidateIf((object, value) => value)
    public readonly recipe_id: number;
}