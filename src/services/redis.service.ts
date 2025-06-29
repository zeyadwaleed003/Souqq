import redis from '../config/redis';

class RedisService {
  async getJSON<T>(key: string): Promise<T | null> {
    const cachedData = await redis.GET(key);
    return cachedData ? JSON.parse(cachedData) : null;
  }

  async setJSON<T>(key: string, ttl: number, value: T) {
    await redis.SETEX(key, ttl, JSON.stringify(value));
  }

  async deleteKeys(pattern: string) {
    const keys = await redis.KEYS(pattern);
    if (keys.length) await redis.DEL(keys);
  }
}

export default new RedisService();
