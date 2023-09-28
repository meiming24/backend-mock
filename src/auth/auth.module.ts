import {Module} from "@nestjs/common";
import {JwtModule} from "@nestjs/jwt";
import {PassportModule} from "@nestjs/passport";
import {AuthService} from "./auth.service";
import {AuthController} from "./auth.controller";
import {JwtStrategy} from "./strategy";

const NESTJS_SECRET_KEY = process.env.NESTJS_SECRET_KEY
const JWT_TOKEN_EXPIRE_DAYS = process.env.JWT_TOKEN_EXPIRE_DAYS

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: "jwt",
            property: "user",
            session: false,
        }),
        JwtModule.register({
            secret: NESTJS_SECRET_KEY,
            signOptions: {
                expiresIn: `${JWT_TOKEN_EXPIRE_DAYS} days`,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {
}
