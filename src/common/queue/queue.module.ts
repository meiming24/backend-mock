import {BullModule} from "@nestjs/bull";
import {
    Global,
    Module
} from "@nestjs/common";
import {QueueService} from './queue.service';
import {EmailProcessor} from "./processor";
import {BullBoardController} from "./bull-board.controller";
import {EmailModule} from "../email";

const host = process.env.REDIS_HOST;
const port = parseInt(process.env.REDIS_PORT);
const password = process.env.REDIS_PASSWORD;

@Global()
@Module({
    imports: [
        BullModule.forRoot({
            redis: {
                host: host,
                port: port,
                password: password,
            },
        }),
        BullModule.registerQueue({
            name: 'email-queue'
        }),
        EmailModule
    ],
    providers: [EmailProcessor, QueueService],
    controllers: [BullBoardController],
    exports: [QueueService],
})
export class QueueModule {
}