import { Type } from "class-transformer";
import { IsDate, IsDefined, IsInt, IsPositive, IsString, Length, ValidateIf } from "class-validator";

export class CommentIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly comment_id: number;
}

export class CommentForeignKeysDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ValidateIf((object, value) => value)
    public readonly recipe_id: number;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    @ValidateIf((object, value) => value)
    public readonly user_id: number;
}

export class CommentCreateDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly user_id: number;

    @IsDefined()
    @IsString()
    @Length(1, 200)
    public readonly comment: string;
}

export class CommentUpdateDto {
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

    @IsDefined()
    @IsString()
    @Length(1, 200)
    @ValidateIf((object, value) => value)
    public readonly comment: string;
}

export class CommentResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly recipe_id: number;

    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly user_id: number;

    @IsDefined()
    @IsString()
    @Length(1, 200)
    public readonly comment: string;

    @IsDefined()
    @IsDate()
    public readonly created_at: Date;
}