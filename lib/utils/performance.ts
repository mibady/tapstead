// Image optimization
export function getOptimizedImageUrl(src: string, width: number, height: number) {
  if (src.includes("placeholder.svg")) {
    return `${src}&width=${width}&height=${height}`
  }

  // For production, use image optimization service
  return src
}

// Lazy loading utility
export function lazyLoad(callback: () => void, delay = 100) {
  if (typeof window !== "undefined") {
    const timer = setTimeout(callback, delay)
    return () => clearTimeout(timer)
  }
}

// Cache management
export class CacheManager {
  private static cache = new Map()

  static set(key: string, value: any, ttl = 300000) {
    // 5 minutes default
    const expiry = Date.now() + ttl
    this.cache.set(key, { value, expiry })
  }

  static get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  static clear() {
    this.cache.clear()
  }
}
