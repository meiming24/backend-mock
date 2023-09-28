import {hash} from "bcrypt";
import * as path from "path";
import * as moment from "moment";
import {JwtService} from "@nestjs/jwt";
import {Injectable} from "@nestjs/common";
import {OAuth2Client} from "google-auth-library";
import {
    PrismaService,
    QueueService
} from "src/common";
import {SALT_OR_ROUNDS} from "src/common/constants";
import { generatePassword } from "./auth.utils";

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService,
                private readonly jwtService: JwtService,
                private readonly queueService: QueueService) {
    }

    async getFirstUser(filter = {}, fields = {}) {
        return this.prisma.user.findFirst({
            where: filter,
            select: fields
        });
    }

    async createToken(userId) {
        const token = await this.prisma.token.create({
            data: {userId: userId},
            select: {id: true}
        });
        return token.id
    }

    generateAccessToken(payload = {}, expireTime = 1) {
        return this.jwtService.sign(payload, {expiresIn: `${expireTime} days`})
    }

    verifyToken(token: string) {
        return this.jwtService.verify(token)
    }

    async getFirstToken(filter = {}, fields = {}) {
        return this.prisma.token.findFirst({
            where: filter,
            select: fields
        });
    }

    async logout(id: string) {
        await this.prisma.token.delete({
            where: {id: id}
        });
    }

    async clearToken(userId: string) {
        await this.prisma.token.deleteMany({where: {userId}});
    }

    async changePassword(email, newPassword) {
        const password = await hash(newPassword, SALT_OR_ROUNDS);
        await this.prisma.user.update({where: {email}, data: {password}})
    }

    async sendForgotPassword(email: string) {
        const code = generatePassword(10);
        const fields = {
            id: true,
            email: true,
            name: true,
            username: true,
            updateAt: true,
            Role: {
                select: {key: true},
            },
        }
        const user = await this.prisma.user.update({
            where: {
                email: email,
            },
            data: {
                code,
                passwordWrongCount: 0
            },
            select: fields,
        });
        const payload = {
            data: {
                ...user,
                resetPasswordToken: code,
                updateAt: moment(user.updateAt).format('YYYY/MM/DD HH:mm:ss')
            },
            context: {
                subject: 'Forgot password',
                template: path.resolve(__dirname, 'templates/forgot-password.hbs')
            }
        };
        this.queueService.sendMail(payload)
    }

    async updateNumberOfFailedLogin(email, numberOfFailedLogin) {
        await this.prisma.user.update({
            where: {email: email},
            data: {passwordWrongCount: numberOfFailedLogin}
        });
    }

    async resetPassword(email, password) {
        const newPasswordHash = await hash(password, SALT_OR_ROUNDS);
        await this.prisma.user.update({
            where: {
                email
            },
            data: {
                password: newPasswordHash,
                code: null,
                passwordWrongCount: 0,
            },
        });
    }

    async googleLogin(token) {
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
        const client = new OAuth2Client(GOOGLE_CLIENT_ID);
        return await client.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID,
        }).then(async (result) => {
            if (result) {
                return result.getPayload();
            }
        }).catch(() => {
            return null
        })
    }
}