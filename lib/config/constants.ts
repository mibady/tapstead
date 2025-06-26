/**
 * @file Application-wide constants
 * @description This file centralizes configuration values that were previously hardcoded
 * or spread across multiple files.
 */

/**
 * Provider matching configuration
 */
export const PROVIDER_MATCHING_CONFIG = {
  DEFAULT_RADIUS_METERS: 50 * 1609.34, // 50 miles in meters
  DEFAULT_MAX_DISTANCE: 50,
  DEFAULT_MIN_RATING: 3,
  DEFAULT_MIN_COMPLETED_JOBS: 10,
  SCORE_WEIGHTS: {
    DISTANCE: 0.4,
    RATING: 0.3,
    EXPERIENCE: 0.1,
    AVAILABILITY: 0.2,
  },
  PRIORITIZED_RATING_WEIGHTS: {
    DISTANCE: 0.3,
    RATING: 0.5,
    EXPERIENCE: 0.1,
    AVAILABILITY: 0.1,
  },
  PRIORITIZED_EXPERIENCE_WEIGHTS: {
    DISTANCE: 0.3,
    RATING: 0.2,
    EXPERIENCE: 0.4,
    AVAILABILITY: 0.1,
  },
};

/**
 * Authentication configuration
 */
export const AUTH_CONFIG = {
  SESSION_EXPIRY: 60 * 60 * 24 * 7, // 7 days in seconds
  REFRESH_TOKEN_EXPIRY: 60 * 60 * 24 * 30, // 30 days in seconds
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 100,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60, // 15 minutes in seconds
  TOKEN_EXPIRY: 60 * 60, // 1 hour in seconds
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_EXPIRY: 10 * 60, // 10 minutes in seconds
};

/**
 * API rate limiting configuration
 */
export const RATE_LIMIT_CONFIG = {
  MAX_REQUESTS_PER_MINUTE: 60,
  RATE_LIMIT_DURATION: 60 * 1000, // 1 minute in milliseconds
  SENSITIVE_ENDPOINTS_MAX_REQUESTS: 10, // Lower limit for sensitive endpoints
};

/**
 * Pricing configuration
 */
export const PRICING_CONFIG = {
  BASE_PRICES: {
    SMALL: 100, // < 1000 sq ft
    MEDIUM: 150, // 1000-2000 sq ft
    LARGE: 200, // 2000-3500 sq ft
    XLARGE: 300, // > 3500 sq ft
  },
  TIME_SLOT_MULTIPLIERS: {
    STANDARD: 1.0,
    PEAK: 1.25,
    OFF_PEAK: 0.85,
  },
  ADDON_PRICES: {
    DEEP_CLEAN: 50,
    WINDOW_CLEANING: 30,
    LAUNDRY: 25,
    FRIDGE_CLEANING: 20,
    OVEN_CLEANING: 25,
  },
  DISCOUNT_THRESHOLDS: {
    RECURRING_BOOKING: 0.1, // 10% discount
    FIRST_TIME_CUSTOMER: 0.15, // 15% discount
    REFERRAL: 0.2, // 20% discount
  },
};

/**
 * Image optimization configuration
 */
export const IMAGE_CONFIG = {
  MAX_WIDTH: 1920,
  MAX_HEIGHT: 1080,
  QUALITY: 80,
  THUMBNAIL_WIDTH: 300,
  THUMBNAIL_HEIGHT: 300,
  THUMBNAIL_QUALITY: 70,
  ALLOWED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};

/**
 * Pagination defaults
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

/**
 * Date and time formats
 */
export const DATE_TIME_FORMATS = {
  DATE_FORMAT: 'YYYY-MM-DD',
  TIME_FORMAT: 'HH:mm',
  DATETIME_FORMAT: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE_FORMAT: 'MMM D, YYYY',
  DISPLAY_TIME_FORMAT: 'h:mm A',
  DISPLAY_DATETIME_FORMAT: 'MMM D, YYYY h:mm A',
};

/**
 * API endpoints
 */
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    GET: (id: string) => `/api/bookings/${id}`,
    UPDATE: (id: string) => `/api/bookings/${id}`,
    DELETE: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    RESCHEDULE: (id: string) => `/api/bookings/${id}/reschedule`,
  },
  PROVIDERS: {
    LIST: '/api/providers',
    GET: (id: string) => `/api/providers/${id}`,
    AVAILABILITY: (id: string) => `/api/providers/${id}/availability`,
    REVIEWS: (id: string) => `/api/providers/${id}/reviews`,
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    ADDRESSES: '/api/users/addresses',
    PAYMENT_METHODS: '/api/users/payment-methods',
  },
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'tapstead_auth_token',
  REFRESH_TOKEN: 'tapstead_refresh_token',
  USER_PROFILE: 'tapstead_user_profile',
  THEME: 'tapstead_theme',
  RECENT_SEARCHES: 'tapstead_recent_searches',
  BOOKING_DRAFT: 'tapstead_booking_draft',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  UNAUTHORIZED: 'You must be logged in to access this resource.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION: 'Please check your input and try again.',
  NETWORK: 'Network error. Please check your connection and try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

/**
 * Feature flags
 */
export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_REVIEWS: true,
  ENABLE_REFERRALS: false,
  ENABLE_SUBSCRIPTIONS: false,
  ENABLE_DARK_MODE: true,
};
