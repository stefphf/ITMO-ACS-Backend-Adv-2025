import { Type } from "class-transformer";
import {
    IsString,
    IsDefined,
    Length,
    Matches,
    IsUrl,
    IsNumber,
    IsDate, 
    ValidateIf,
    IsJWT,
    IsInt
} from "class-validator"

const usernameRegex = new RegExp("^([\\w\\d\\-\\.]*)$");

export class UserIdParamDto {
  @IsInt()
  @Type(() => Number)
  user_id: number;
}

export class UserIdDto {
    @IsDefined()
    @IsNumber()
    public readonly id: number;
}

export class RegisterUserDto {
    @IsDefined({message: "username is required"})
    @IsString({message: "username is invalid string"})
    @Matches(usernameRegex, {message: "username contains invalid symbols"})
    @Length(8, 50, {message: "username length must be between 8 and 50 characters"})
    public readonly username: string;

    @IsDefined({message: "password is required"})
    @IsString({message: "password is invalid string"})
    @Length(8, 100, {message: "password length must be between 8 and 100 characters"})
    public readonly password: string;

    @IsDefined({message: "password_confirm is required"})
    @IsString({message: "password_confirm is invalid string"})
    @Length(8, 100, {message: "password_confirm length must be between 8 and 100 characters"})
    public readonly password_confirm: string;
}

export class LoginUserDto {
    @IsDefined({message: "username is required"})
    @IsString({message: "username is invalid string"})
    @Matches(usernameRegex, {message: "username contains invalid symbols"})
    @Length(8, 50, {message: "username length must be between 8 and 50 characters"})
    public readonly username: string;

    @IsDefined({message: "password is required"})
    @IsString({message: "password is invalid string"})
    @Length(8, 100, {message: "password length must be between 8 and 100 characters"})
    public readonly password: string;
}

export class UserUpdateDto {
    @IsUrl()
    @ValidateIf((object, value) => value)
    public readonly avatar_url: string | null;
    
    @IsString()
    @Length(0, 800)
    @ValidateIf((object, value) => value)
    public readonly bio: string | null;
}

export class UserResponseDto extends UserIdDto {

    @IsDefined({message: "username is required"})
    @IsString({message: "username is invalid string"})
    @Matches(usernameRegex, {message: "username contains invalid symbols"})
    @Length(8, 50, {message: "username length must be between 8 and 50 characters"})
    public readonly username: string;

    @IsUrl()
    @ValidateIf((object, value) => value !== null)
    public readonly avatar_url: string | null;
    
    @IsString()
    @Length(0, 800)
    @ValidateIf((object, value) => value !== null)
    public readonly bio: string | null;

    @IsDefined()
    @IsDate()
    public readonly created_at: Date;
}

export class TokenResponse {
    @IsDefined()
    @IsJWT()
    public readonly access_token: string;
}
