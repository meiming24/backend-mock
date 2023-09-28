import {join} from 'path';
import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {EmailService} from './email.service';

const MAIL_HOST = process.env.MAIL_HOST
const MAIL_USER = process.env.MAIL_USER
const MAIL_SECRET = process.env.MAIL_SECRET
const DEFAULT_FROM_EMAIL = process.env.DEFAULT_FROM_EMAIL

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: MAIL_HOST,
                secure: false,
                auth: {
                    user: MAIL_USER,
                    pass: MAIL_SECRET,
                },
            },
            defaults: {
                from: DEFAULT_FROM_EMAIL,
            },
            template: {
                dir: join(__dirname, 'templates'),
                adapter: new HandlebarsAdapter(),
                options: {
                    strict: true,
                },
            },
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule {
}