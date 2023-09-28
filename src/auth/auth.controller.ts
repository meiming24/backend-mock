import {compare} from "bcrypt";
import {Response} from 'express';
import * as _ from "lodash";
import {
    Request,
    Body,
    Controller,
    Post,
    UseGuards,
    Res,
    HttpCode,
    UnauthorizedException,
    BadRequestException,
} from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from "@nestjs/swagger";
import {
    JWTAuthGuard
} from "src/common/guard";
import {ErrorResponse} from "src/common/error-response";
import {NUMBER_OF_FAILED_LOGIN} from "src/common/constants";
import {
    LoginUserDto,
    ResetPasswordDto,
    ChangePasswordDto,
    LoginResponseDto,
    RefreshTokenResponseDto,
    ChangePasswordResponseDto,
    ForgotPasswordDto,
    ForgotPasswordResponseDto,
    ResetPasswordResponseDto,
    RefreshTokenRequestDto,
    LoginGoogleResponseDto,
    LoginGoogleRequestDto
} from "./dto";
import {AuthService} from "./auth.service";


@Controller("auth")
@ApiTags("Authentication")
@ApiResponse({status: 400, type: ErrorResponse})
@ApiResponse({status: 500, type: ErrorResponse})
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post("login")
    @HttpCode(200)
    @ApiOperation({summary: "Login user"})
    @ApiResponse({status: 200, type: LoginResponseDto})
    async login(@Body() payload: LoginUserDto, @Res() response: Response) {
        const {accountName, password} = payload;
        const filter = {name: accountName}
        const fields = {
            id: true,
            email: true,
            name: true,
            username: true,
            password: true,
            Role: {
                select: {key: true},
            },
        }
        const user: any = await this.authService.getFirstUser(filter, fields)
        if (!user || !(await compare(password, user.password))) {
            throw new UnauthorizedException('Invalid account name or password.')
        }

        const userId = user.id
        const userRole = user.Role.key
        const email = user.email
        const username = user.username
        const tokenExpireTime = parseInt(process.env.JWT_TOKEN_EXPIRE_DAYS)
        const refreshTokenExpireTime = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
        const idToken = await this.authService.createToken(userId);
        const accessToken = this.authService.generateAccessToken({
            email,
            idToken,
            id: userId,
            role: userRole
        }, tokenExpireTime)
        const refreshToken = this.authService.generateAccessToken({
            idToken,
            refresh: true,
            id: userId,
        }, refreshTokenExpireTime)

        const result = {
            tokenType: "Bearer",
            accessToken,
            refreshToken,
            user: {
                id: userId,
                username: username,
                email: email,
                role: userRole
            }
        }
        response.status(200).json(result)
    }

    @Post("logout")
    @ApiBearerAuth()
    @HttpCode(204)
    @UseGuards(JWTAuthGuard)
    @ApiOperation({summary: "Logout user"})
    async logout(@Request() request: any, @Res() response: Response) {
        const user = request.user
        const idToken = user.idToken
        const token = await this.authService.getFirstToken({id: idToken}, {id: true})
        if (!token) {
            throw new UnauthorizedException('The invalid access token.')
        }
        await this.authService.logout(idToken);
        response.status(204).json()
    }

    @Post("refresh-token")
    @HttpCode(200)
    @ApiResponse({status: 200, type: RefreshTokenResponseDto})
    @ApiOperation({summary: "Get refresh token"})
    async refreshToken(@Body() payload: RefreshTokenRequestDto, @Res() response: Response) {
        const {token} = payload
        const data = _.attempt(() => this.authService.verifyToken(token))
        if (_.isError(data)) {
            throw  new UnauthorizedException("The invalid refresh token.")
        }
        if (!data.refresh) {
            throw new UnauthorizedException('The invalid refresh token.')
        }

        const userId = data.id
        let idToken = data.idToken
        const fields = {
            id: true,
            email: true,
            username: true,
            Role: {
                select: {key: true},
            },
        }
        const tokenExpireTime = parseInt(process.env.JWT_TOKEN_EXPIRE_DAYS)
        const refreshTokenExpireTime = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS)

        const tokenInfo = await this.authService.getFirstToken({id: idToken}, {id: true})
        if (!tokenInfo) {
            throw new UnauthorizedException('The invalid access token.')
        }
        await this.authService.logout(idToken);
        const user: any = await this.authService.getFirstUser({id: userId}, fields)
        if (!user) {
            throw new UnauthorizedException('The user object does not exist.')
        }

        idToken = await this.authService.createToken(userId);
        const accessToken = this.authService.generateAccessToken({
            idToken,
            id: userId,
            email: user.email,
            role: user.Role.key
        }, tokenExpireTime)
        const refreshToken = this.authService.generateAccessToken({
            idToken,
            id: userId,
            refresh: true,
        }, refreshTokenExpireTime)

        response.status(200).json({
            tokenType: "Bearer",
            accessToken,
            refreshToken
        })
    }

    @Post("change-password")
    @ApiBearerAuth()
    @HttpCode(200)
    @UseGuards(JWTAuthGuard)
    @ApiResponse({status: 200, type: ChangePasswordResponseDto})
    @ApiOperation({summary: "Change password"})
    async changePassword(@Body() payload: ChangePasswordDto, @Res() response: Response) {
        const {email, oldPassword, newPassword} = payload;
        const filter = {email}
        const fields = {
            id: true,
            email: true,
            password: true,
        }

        const user: any = await this.authService.getFirstUser(filter, fields)
        if (!user) {
            throw new BadRequestException('The user object does not exist.')
        }
        if (!await compare(oldPassword, user.password)) {
            throw new UnauthorizedException('The old password is incorrect.')
        }
        await this.authService.changePassword(email, newPassword);
        await this.authService.clearToken(user.id);

        response.status(200).json({
            message: 'The password has been reset.'
        })
    }

    @Post("forgot-password")
    @HttpCode(200)
    @ApiOperation({summary: "Forgot password"})
    @ApiResponse({status: 200, type: ForgotPasswordResponseDto})
    async forgotPassword(@Body() payload: ForgotPasswordDto, @Res() response: Response) {
        const email = payload.email
        const filter = {email}
        const fields = {
            id: true,
            email: true,
            passwordWrongCount: true,
            updateAt: true
        }
        const user: any = await this.authService.getFirstUser(filter, fields)
        if (!user) {
            throw new BadRequestException('Email does not exist.')
        }
        const currentTime = new Date().getTime()
        const expireTime = (new Date(user.updateAt)).getTime() + (60 * 60 * 1000)
        if (user.passwordWrongCount >= NUMBER_OF_FAILED_LOGIN && expireTime > currentTime) {
            throw new BadRequestException('User is being blocked.')
        }
        await this.authService.sendForgotPassword(email);
        await this.authService.clearToken(user.id);
        response.status(200).json({
            message: 'Please check your email to receive the code.'
        })
    }

    @Post("reset-password")
    @HttpCode(200)
    @ApiOperation({summary: "Reset password"})
    @ApiResponse({status: 200, type: ResetPasswordResponseDto})
    async resetPassword(@Body() payload: ResetPasswordDto, @Res() response: Response) {
        const {token, newPassword, email} = payload;
        const filter = {email}
        const fields = {
            id: true,
            code: true,
            email: true,
            passwordWrongCount: true,
            updateAt: true
        }
        const user: any = await this.authService.getFirstUser(filter, fields)
        if (!user) {
            throw new BadRequestException('The user object does not exist.')
        }
        if (user.code !== token) {
            const numberOfFailedLogin = (user.passwordWrongCount || 0) + 1;
            await this.authService.updateNumberOfFailedLogin(email, numberOfFailedLogin)
            throw new BadRequestException('Invalid token.')
        }
        const currentTime = new Date().getTime()
        const expireTime = (new Date(user.updateAt)).getTime() + (60 * 60 * 1000)
        const expireTimeReset = (new Date(user.updateAt)).getTime() + (15 * 60 * 1000)
        if (user.passwordWrongCount >= NUMBER_OF_FAILED_LOGIN && expireTime > currentTime) {
            throw new BadRequestException('User is being blocked.')
        }
        if (expireTimeReset < currentTime) {
            throw new BadRequestException('Temporary password has expired.');
        }
        await this.authService.resetPassword(email, newPassword);
        response.status(200).json({
            message: 'Password reset successfully.'
        })
    }

    @Post('google')
    @HttpCode(200)
    @ApiOperation({summary: "Login with google"})
    @ApiResponse({status: 200, type: LoginGoogleResponseDto})
    async googleLogin(@Body() payload: LoginGoogleRequestDto, @Res() response: Response) {
        const {idToken} = payload
        const data: any = await this.authService.googleLogin(idToken)
        if (!data) {
            throw new UnauthorizedException("The invalid access token.")
        }
        const email = data.email
        const fields = {
            id: true,
            email: true,
            name: true,
            username: true,
            password: true,
            Role: {
                select: {key: true},
            },
        }
        const user: any = await this.authService.getFirstUser({email}, fields)
        if (!user) {
            throw new UnauthorizedException('This account is invalid.')
        }
        const userId = user.id
        const userRole = user.Role.key
        const username = user.username
        const tokenExpireTime = parseInt(process.env.JWT_TOKEN_EXPIRE_DAYS)
        const refreshTokenExpireTime = parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS)
        const tokenId = await this.authService.createToken(userId);
        const accessToken = this.authService.generateAccessToken({
            email,
            id: userId,
            role: userRole,
            idToken: tokenId,
        }, tokenExpireTime)
        const refreshToken = this.authService.generateAccessToken({
            refresh: true,
            id: userId,
            idToken: tokenId,
        }, refreshTokenExpireTime)
        const result = {
            tokenType: "Bearer",
            accessToken,
            refreshToken,
            user: {
                id: userId,
                username: username,
                email: email,
                role: userRole
            }
        }
        response.status(200).json(result)
    }
}
