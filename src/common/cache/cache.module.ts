import {
    Global,
    Module
} from '@nestjs/common';
import {RedisCacheService} from './cache.service';

@Global()
@Module({
    providers: [
        {
            provide: RedisCacheService,
            useFactory: () => {
                const host = process.env.REDIS_HOST;
                const port = parseInt(process.env.REDIS_PORT);
                const password = process.env.REDIS_PASSWORD;
                return new RedisCacheService(host, port, password);
            },
        },
    ],
    exports: [RedisCacheService],
})
export class RedisCacheModule {
}