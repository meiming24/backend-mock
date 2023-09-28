import {JobOptions, Queue} from "bull";
import {InjectQueue} from "@nestjs/bull";
import {Injectable} from "@nestjs/common";
import {queuePool} from "./bull-board.queue";

@Injectable()
export class QueueService {
    constructor(
        @InjectQueue('email-queue') private emailQueue: Queue) {
        queuePool.add(emailQueue);
    }

    sendMail(data, opts?: JobOptions) {
        this.emailQueue.add(data, opts);
    }
}
