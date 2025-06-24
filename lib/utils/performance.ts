import { IMAGE_CONFIG } from '../config/constants';

/**
 * Image optimization utility
 * Generates optimized image URLs based on configuration
 */
export function getOptimizedImageUrl(src: string, width: number, height: number) {
  if (src.includes("placeholder.svg")) {
    return `${src}&width=${width}&height=${height}`;
  }

  // If using Next.js Image component, this would be handled automatically
  // For custom implementation with external services like Cloudinary or Imgix
  const maxWidth = Math.min(width, IMAGE_CONFIG.MAX_WIDTH);
  const maxHeight = Math.min(height, IMAGE_CONFIG.MAX_HEIGHT);
  const quality = IMAGE_CONFIG.QUALITY;
  
  // Example implementation for a hypothetical image service
  // In production, replace with actual image optimization service URL structure
  if (src.startsWith('http') || src.startsWith('https')) {
    return `${src}?w=${maxWidth}&h=${maxHeight}&q=${quality}&auto=format`;
  }
  
  return src;
}

/**
 * Lazy loading utility
 * Delays execution of a callback function
 */
export function lazyLoad(callback: () => void, delay = 100) {
  if (typeof window !== "undefined") {
    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }
  return () => {}; // Return empty function for SSR
}

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  value: T;
  expiry: number;
}

/**
 * Cache management
 * Provides in-memory caching with TTL support
 */
export class CacheManager {
  private static cache = new Map<string, CacheEntry<any>>();

  /**
   * Set a value in the cache with an optional TTL
   */
  static set<T>(key: string, value: T, ttl = 300000) {
    // 5 minutes default
    const expiry = Date.now() + ttl;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Get a value from the cache
   * Returns null if the key doesn't exist or has expired
   */
  static get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Check if a key exists in the cache and is not expired
   */
  static has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Delete a specific key from the cache
   */
  static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all items from the cache
   */
  static clear(): void {
    this.cache.clear();
  }
  
  /**
   * Clean expired items from the cache
   * Returns the number of items removed
   */
  static cleanExpired(): number {
    const now = Date.now();
    let count = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
        count++;
      }
    }
    
    return count;
  }
}

/**
 * Memoization options
 */
export interface MemoizeOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Max cache size */
  maxCacheSize?: number;
  /** Custom cache key generator */
  cacheKeyFn?: (...args: any[]) => string;
}

/**
 * Default memoize options
 */
const DEFAULT_MEMOIZE_OPTIONS: MemoizeOptions = {
  ttl: 5 * 60 * 1000, // 5 minutes
  maxCacheSize: 100,
};

/**
 * Memoize a function to cache its results
 * 
 * @param fn - Function to memoize
 * @param options - Memoization options
 * @returns Memoized function
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: MemoizeOptions = {}
): (...args: Parameters<T>) => ReturnType<T> {
  const opts = { ...DEFAULT_MEMOIZE_OPTIONS, ...options };
  const cache = new Map<string, { value: ReturnType<T>; expiry: number }>();
  
  // Default cache key function stringifies all arguments
  const defaultCacheKeyFn = (...args: Parameters<T>): string => {
    return JSON.stringify(args);
  };
  
  const cacheKeyFn = opts.cacheKeyFn || defaultCacheKeyFn;
  
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const key = cacheKeyFn(...args);
    const now = Date.now();
    const cached = cache.get(key);
    
    // Return cached value if it exists and hasn't expired
    if (cached && cached.expiry > now) {
      return cached.value;
    }
    
    // If cache is at max size, remove oldest entry
    if (opts.maxCacheSize && cache.size >= opts.maxCacheSize) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey) cache.delete(oldestKey);
    }
    
    // Calculate the result and cache it
    const result = fn.apply(this, args);
    
    // Handle promises
    if (result instanceof Promise) {
      return result.then(value => {
        cache.set(key, { value, expiry: now + (opts.ttl || 0) });
        return value;
      }) as ReturnType<T>;
    }
    
    // Cache the result
    cache.set(key, { value: result, expiry: now + (opts.ttl || 0) });
    return result;
  };
}

/**
 * Debounce function to limit the rate at which a function can fire
 * 
 * @param fn - Function to debounce
 * @param wait - Milliseconds to wait before executing
 * @param immediate - Execute at the beginning of the debounce period instead of the end
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait = 300,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const later = () => {
      timeout = null;
      if (!immediate) fn.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) fn.apply(this, args);
  };
}

/**
 * Throttle function to limit the rate at which a function can fire
 * 
 * @param fn - Function to throttle
 * @param limit - Milliseconds to wait between executions
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: any = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          fn.apply(lastThis, lastArgs);
          lastArgs = null;
        }
      }, limit);
    } else {
      lastArgs = args;
      lastThis = this;
    }
  };
}
