import {
    IsNotEmpty,
    IsString,
    Length,
    IsEmail
} from "class-validator";

export class LoginUserDto {
    @Length(1, 255)
    @IsString()
    @IsNotEmpty()
    accountName: string;

    @Length(8, 255)
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenRequestDto {
    @Length(1, 10000)
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class ChangePasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(8, 255)
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @Length(8, 255)
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}

export class ForgotPasswordDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @Length(8, 255)
    @IsString()
    @IsNotEmpty()
    token: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Length(8, 255)
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}


export class LoginGoogleRequestDto {
    @Length(1, 10000)
    @IsString()
    @IsNotEmpty()
    idToken: string;
}