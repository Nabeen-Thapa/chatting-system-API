import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
        });

        this.client.on('connect', () => {
            console.log('Redis connected');
        });

        this.client.on('error', (err) => {
            console.log(' Redis error:', err);
        });
    }

    async set(key: string, value: any, ttl?: number) {
        if (ttl) {
            await this.client.set(key, JSON.stringify(value), 'EX', ttl)
        } else {
            await this.client.set(key, JSON.stringify(value));
        }
    }

    async get<T>(key: string): Promise<T | null> {
        const data = await this.client.get(key);
        if (!data) return null;
        return JSON.parse(data);
    }

    async onModuleDestroy() {
        await this.client.quit();
    }
}
