import redis from '../config/redis';
import { TResponse } from '../types/api.types';

class RedisService {
  async getJSON(key: string): Promise<TResponse | null> {
    const cachedData = await redis.GET(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  async setJSON(key: string, ttl: number, value: TResponse) {
    await redis.SETEX(key, ttl, JSON.stringify(value));
  }

  async deleteKeys(pattern: string) {
    const keys = await redis.KEYS(pattern);
    if (keys.length) await redis.DEL(keys);
  }
}

export default new RedisService();
