import { Type } from "class-transformer";
import { IsDefined, IsInt, IsPositive, IsString, Length } from "class-validator";

export class TagIdParamDto {
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public readonly tag_id: number
}

export class TagCreateDto {
    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string;
}

export class TagUpdateDto {
    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string;
}

export class TagResponseDto {
    @IsDefined()
    @IsInt()
    @IsPositive()
    public readonly id: number

    @IsDefined()
    @IsString()
    @Length(1, 50)
    public readonly name: string;
}