import {Redis} from 'ioredis';
import {Injectable} from '@nestjs/common';

@Injectable()
export class RedisCacheService {
    private client: Redis;

    constructor(host: string, port: number, password: string) {
        this.client = new Redis({host, port, password});
    }

    createKey(prefix: string, suffix: string): string {
        return `${prefix}:${suffix}`;
    }

    async get(key: string): Promise<any> {
        const data = await this.client.get(key);
        return data ? JSON.parse(data) : null;
    }

    async set(key: string, value: any, options?: { ttl?: number }): Promise<void> {
        const {ttl} = options || {};
        const data = JSON.stringify(value);
        if (ttl) {
            await this.client.setex(key, ttl, data);
        } else {
            await this.client.set(key, data);
        }
    }

    async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    async flushAll(): Promise<void> {
        await this.client.flushall();
    }

    async quit(): Promise<void> {
        await this.client.quit();
    }
}