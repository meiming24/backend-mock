import {Module} from "@nestjs/common";
import {
    PrismaModule,
    RedisCacheModule,
    QueueModule
} from "./common";
import {AuthModule} from "./auth/auth.module";
import { ScheduleModule } from '@nestjs/schedule';


@Module({
    imports: [
        ScheduleModule.forRoot(),
        AuthModule,
        PrismaModule, 
        RedisCacheModule, 
        QueueModule,
    ]
})
export class AppModule {
}
