import { IsBoolean, IsDefined, IsString } from "class-validator";

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