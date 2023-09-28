import {ApiProperty} from "@nestjs/swagger";

class UserInfo {
    @ApiProperty({type: 'string'})
    id?: string;
    @ApiProperty({type: 'string'})
    username?: string;
    @ApiProperty({type: 'string'})
    email?: string;
    @ApiProperty({type: 'string'})
    role?: string;
}

export class LoginResponseDto {
    user?: UserInfo
    @ApiProperty({type: 'string'})
    accessToken?: string
    @ApiProperty({type: 'string'})
    refreshToken?: string
    @ApiProperty({type: 'string'})
    tokenType: string
}


export class RefreshTokenResponseDto {
    @ApiProperty({type: 'string'})
    accessToken?: string
    @ApiProperty({type: 'string'})
    refreshToken?: string
    @ApiProperty({type: 'string'})
    tokenType: string
}


export class ChangePasswordResponseDto {
    @ApiProperty({type: 'string'})
    message?: string
}

export class ForgotPasswordResponseDto {
    @ApiProperty({type: 'string'})
    message?: string
}

export class ResetPasswordResponseDto {
    @ApiProperty({type: 'string'})
    message?: string
}

export class LoginGoogleResponseDto {
    user?: UserInfo
    @ApiProperty({type: 'string'})
    accessToken?: string
    @ApiProperty({type: 'string'})
    refreshToken?: string
    @ApiProperty({type: 'string'})
    tokenType: string
}