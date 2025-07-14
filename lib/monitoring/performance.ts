import { redis, CACHE_TTL } from "@/lib/cache/redis"

export interface PerformanceMetrics {
  timestamp: number
  endpoint: string
  method: string
  duration: number
  statusCode: number
  userId?: string
  userAgent?: string
  ip?: string
}

export interface SystemMetrics {
  timestamp: number
  memoryUsage: NodeJS.MemoryUsage
  uptime: number
  activeConnections: number
  cacheHitRate: number
}

export interface EventData {
  name: string
  metadata?: Record<string, any>
  duration?: number
  userId?: string
  sessionId?: string
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: PerformanceMetrics[] = []
  private cacheHits = 0
  private cacheMisses = 0

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  async recordMetric(metric: PerformanceMetrics): Promise<void> {
    this.metrics.push(metric)

    // Store in Redis for persistence
    const key = `performance:${Date.now()}`
    await redis.setex(key, CACHE_TTL.BOOKING_COUNT, JSON.stringify(metric))

    // Keep only last 1000 metrics in memory
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }
  }

  async trackEvent(eventData: EventData): Promise<void> {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      endpoint: eventData.name,
      method: "EVENT",
      duration: eventData.duration || 0,
      statusCode: 200,
      userId: eventData.userId,
    }

    await this.recordMetric(metric)

    // Store event-specific data
    const eventKey = `event:${eventData.name}:${Date.now()}`
    await redis.setex(eventKey, CACHE_TTL.BOOKING_COUNT, JSON.stringify(eventData))
  }

  recordCacheHit(): void {
    this.cacheHits++
  }

  recordCacheMiss(): void {
    this.cacheMisses++
  }

  getCacheHitRate(): number {
    const total = this.cacheHits + this.cacheMisses
    return total > 0 ? this.cacheHits / total : 0
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    return {
      timestamp: Date.now(),
      memoryUsage: process.memoryUsage(),
      uptime: process.uptime(),
      activeConnections: this.metrics.length,
      cacheHitRate: this.getCacheHitRate(),
    }
  }

  async getMetricsSummary(timeRange = 3600000): Promise<{
    totalRequests: number
    averageResponseTime: number
    errorRate: number
    slowestEndpoints: Array<{ endpoint: string; averageTime: number }>
  }> {
    const cutoff = Date.now() - timeRange
    const recentMetrics = this.metrics.filter((m) => m.timestamp > cutoff)

    const totalRequests = recentMetrics.length
    const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalRequests || 0
    const errorCount = recentMetrics.filter((m) => m.statusCode >= 400).length
    const errorRate = totalRequests > 0 ? errorCount / totalRequests : 0

    // Group by endpoint and calculate average response time
    const endpointStats = recentMetrics.reduce(
      (acc, metric) => {
        const key = `${metric.method} ${metric.endpoint}`
        if (!acc[key]) {
          acc[key] = { total: 0, count: 0 }
        }
        acc[key].total += metric.duration
        acc[key].count++
        return acc
      },
      {} as Record<string, { total: number; count: number }>,
    )

    const slowestEndpoints = Object.entries(endpointStats)
      .map(([endpoint, stats]) => ({
        endpoint,
        averageTime: stats.total / stats.count,
      }))
      .sort((a, b) => b.averageTime - a.averageTime)
      .slice(0, 10)

    return {
      totalRequests,
      averageResponseTime,
      errorRate,
      slowestEndpoints,
    }
  }

  async clearOldMetrics(olderThan = 86400000): Promise<void> {
    const cutoff = Date.now() - olderThan
    this.metrics = this.metrics.filter((m) => m.timestamp > cutoff)

    // Also clear from Redis
    const keys = await redis.keys("performance:*")
    for (const key of keys) {
      const data = await redis.get(key)
      if (data) {
        const metric = JSON.parse(data as string) as PerformanceMetrics
        if (metric.timestamp < cutoff) {
          await redis.del(key)
        }
      }
    }
  }
}

// Middleware helper for automatic performance tracking
export function withPerformanceTracking<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
  endpoint: string,
): T {
  return (async (...args: any[]) => {
    const start = Date.now()
    const monitor = PerformanceMonitor.getInstance()

    try {
      const response = await handler(...args)
      const duration = Date.now() - start

      await monitor.recordMetric({
        timestamp: start,
        endpoint,
        method: "POST", // Adjust based on your needs
        duration,
        statusCode: response.status,
      })

      return response
    } catch (error) {
      const duration = Date.now() - start

      await monitor.recordMetric({
        timestamp: start,
        endpoint,
        method: "POST",
        duration,
        statusCode: 500,
      })

      throw error
    }
  }) as T
}

// Named export for trackEvent
export async function trackEvent(
  name: string,
  metadata?: Record<string, any>,
  duration?: number,
  userId?: string,
  sessionId?: string,
): Promise<void> {
  const monitor = PerformanceMonitor.getInstance()
  await monitor.trackEvent({
    name,
    metadata,
    duration,
    userId,
    sessionId,
  })
}
