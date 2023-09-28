import {Injectable} from "@nestjs/common";
import {MailerService} from "@nestjs-modules/mailer";
import {
    Context,
    Payload
} from "./email.interface";

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {
    }

    async sendMail(payload: Payload, context: Context) {
        await this.mailerService.sendMail({
            subject: context.subject,
            template: context.template,
            to: payload.email,
            context: {
                user: payload,
                context: context
            },
        })
    }
}