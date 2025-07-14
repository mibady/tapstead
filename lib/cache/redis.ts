import { Redis } from "@upstash/redis"

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error("Missing Upstash Redis environment variables")
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// Cache keys
export const CACHE_KEYS = {
  PRICING: (size: string, frequency: string, addons: string) => `pricing:${size}:${frequency}:${addons}`,
  AVAILABILITY: (date: string, zipCode: string) => `availability:${date}:${zipCode}`,
  USER_SESSION: (userId: string) => `session:${userId}`,
  RATE_LIMIT: (ip: string, endpoint: string) => `rate_limit:${ip}:${endpoint}`,
  BOOKING_COUNT: (date: string) => `booking_count:${date}`,
} as const

// Cache TTL (Time To Live) in seconds
export const CACHE_TTL = {
  PRICING: 3600, // 1 hour
  AVAILABILITY: 300, // 5 minutes
  USER_SESSION: 86400, // 24 hours
  RATE_LIMIT: 3600, // 1 hour
  BOOKING_COUNT: 86400, // 24 hours
} as const

// Helper functions
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data as T
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCachedData<T>(key: string, data: T, ttl: number = CACHE_TTL.PRICING): Promise<boolean> {
  try {
    await redis.setex(key, ttl, JSON.stringify(data))
    return true
  } catch (error) {
    console.error("Redis set error:", error)
    return false
  }
}

export async function deleteCachedData(key: string): Promise<boolean> {
  try {
    await redis.del(key)
    return true
  } catch (error) {
    console.error("Redis delete error:", error)
    return false
  }
}

// Rate limiting helper
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit = 10,
): Promise<{ allowed: boolean; remaining: number }> {
  const key = CACHE_KEYS.RATE_LIMIT(ip, endpoint)

  try {
    const current = await redis.incr(key)

    if (current === 1) {
      await redis.expire(key, CACHE_TTL.RATE_LIMIT)
    }

    const remaining = Math.max(0, limit - current)

    return {
      allowed: current <= limit,
      remaining,
    }
  } catch (error) {
    console.error("Rate limit check error:", error)
    return { allowed: true, remaining: limit }
  }
}

// CacheService class for compatibility
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    return getCachedData<T>(key)
  }

  static async set<T>(key: string, data: T, ttl?: number): Promise<boolean> {
    return setCachedData(key, data, ttl)
  }

  static async delete(key: string): Promise<boolean> {
    return deleteCachedData(key)
  }

  static async cacheAnalytics<T>(key: string, data: T, ttl: number): Promise<boolean> {
    return setCachedData(key, data, ttl)
  }

  static async getAnalytics<T>(key: string): Promise<T | null> {
    return getCachedData<T>(key)
  }

  static async checkRateLimit(
    ip: string,
    endpoint: string,
    limit = 10,
  ): Promise<{ allowed: boolean; remaining: number }> {
    return checkRateLimit(ip, endpoint, limit)
  }
}
