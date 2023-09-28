import {Job} from 'bull';
import {
    Process,
    Processor
} from '@nestjs/bull';
import {EmailService} from 'src/common';

@Processor('email-queue')
export class EmailProcessor {

    constructor(private readonly emailService: EmailService) {
    }

    @Process()
    async process(job: Job) {
        const payload = job.data;
        await this.emailService.sendMail(payload.data, payload.context);
    }

}