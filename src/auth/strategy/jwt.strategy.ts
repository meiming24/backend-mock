import {
    Injectable,
    UnauthorizedException
} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {
    ExtractJwt,
    Strategy
} from "passport-jwt";
import {
    PrismaService,
    WorkStatusEnum
} from "src/common";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        const secretKey = process.env.NESTJS_SECRET_KEY
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: secretKey
        });
    }

    async validate(payload) {
        const userId = payload.id
        const idToken = payload.idToken

        if (payload?.refresh) {
            throw new UnauthorizedException("Invalid token.")
        }
        const obj = await this.prisma.user.findFirst({
            where: {
                id: userId,
                status: WorkStatusEnum.ACTIVE
            }
        })
        if (!obj) {
            throw new UnauthorizedException("Invalid token.")
        }
        const tokenInfo = await this.prisma.token.findFirst({
            where: {
                id: idToken,
                userId
            }
        })
        if (!tokenInfo) {
            throw new UnauthorizedException("Invalid token.")
        }
        return payload;
    }
}

