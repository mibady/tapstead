/**
 * Standard error codes used throughout the application
 */
export enum ErrorCode {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  RESOURCE_EXHAUSTED = 'RESOURCE_EXHAUSTED',
  
  // Input validation errors
  INVALID_ARGUMENT = 'INVALID_ARGUMENT',
  INVALID_FORMAT = 'INVALID_FORMAT',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS',
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
  UNAVAILABLE = 'UNAVAILABLE',
  
  // System errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  TIMEOUT = 'TIMEOUT',
  
  // Rate limiting
  RATE_LIMITED = 'RATE_LIMITED',
  
  // Other
  UNKNOWN = 'UNKNOWN'
}

/**
 * Standard HTTP status codes mapped to common scenarios
 */
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  SERVICE_UNAVAILABLE = 503
}

/**
 * Error details object for providing additional context
 */
export interface ErrorDetails {
  [key: string]: unknown;
}

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
    public code: ErrorCode = ErrorCode.INTERNAL_ERROR,
    public details?: ErrorDetails
  ) {
    super(message);
    this.name = "AppError";
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  /**
   * Convert error to a plain object for logging or serialization
   */
  toObject(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}

/**
 * Handle database-related errors
 */
export function handleDatabaseError(error: unknown): AppError {
  console.error("Database error:", error);
  
  // Type guard for error with code property
  const hasCode = (err: unknown): err is { code: string } => 
    typeof err === 'object' && err !== null && 'code' in err;
    
  // Type guard for error with message property
  const hasMessage = (err: unknown): err is { message: string } => 
    typeof err === 'object' && err !== null && 'message' in err && 
    typeof (err as any).message === 'string';

  // Supabase specific errors
  if (hasCode(error)) {
    // Unique constraint violation
    if (error.code === "23505") {
      return new AppError(
        "This record already exists", 
        HttpStatus.CONFLICT, 
        ErrorCode.DUPLICATE_RECORD
      );
    }

    // Foreign key constraint violation
    if (error.code === "23503") {
      return new AppError(
        "Referenced record not found", 
        HttpStatus.NOT_FOUND, 
        ErrorCode.FOREIGN_KEY_VIOLATION
      );
    }

    // No rows found
    if (error.code === "PGRST116") {
      return new AppError(
        "No rows found", 
        HttpStatus.NOT_FOUND, 
        ErrorCode.NOT_FOUND
      );
    }
    
    // Check constraint violation
    if (error.code === "23514") {
      return new AppError(
        "Data validation failed", 
        HttpStatus.UNPROCESSABLE_ENTITY, 
        ErrorCode.BUSINESS_RULE_VIOLATION
      );
    }
  }

  // Auth errors
  if (hasMessage(error)) {
    if (error.message.includes("JWT") || error.message.includes("token")) {
      return new AppError(
        "Authentication required", 
        HttpStatus.UNAUTHORIZED, 
        ErrorCode.AUTH_REQUIRED
      );
    }
  }

  // Generic database error
  return new AppError(
    "A database error occurred", 
    HttpStatus.INTERNAL_SERVER_ERROR, 
    ErrorCode.DATABASE_ERROR
  );
}

/**
 * Handle API errors and convert to appropriate Response
 */
export function handleApiError(error: unknown) {
  // If it's already an AppError, use it directly
  if (error instanceof AppError) {
    return Response.json(
      {
        error: error.message,
        code: error.code,
        details: error.details
      },
      { status: error.statusCode }
    );
  }
  
  // Convert unknown errors to AppError
  const appError = convertToAppError(error);
  
  return Response.json(
    {
      error: appError.message,
      code: appError.code,
      details: appError.details
    },
    { status: appError.statusCode }
  );
}

/**
 * Convert any error to an AppError
 */
export function convertToAppError(error: unknown): AppError {
  // If it's already an AppError, return it
  if (error instanceof AppError) {
    return error;
  }
  
  // Handle Error instances
  if (error instanceof Error) {
    return new AppError(
      error.message || 'An unexpected error occurred',
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR,
      { originalError: error.name }
    );
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return new AppError(
      error,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCode.INTERNAL_ERROR
    );
  }
  
  // Handle unknown errors
  return new AppError(
    'An unexpected error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCode.UNKNOWN,
    { originalError: String(error) }
  );
}

/**
 * Create a validation error
 */
export function createValidationError(message: string, details?: ErrorDetails): AppError {
  return new AppError(
    message,
    HttpStatus.BAD_REQUEST,
    ErrorCode.INVALID_ARGUMENT,
    details
  );
}

/**
 * Create a not found error
 */
export function createNotFoundError(resource: string): AppError {
  return new AppError(
    `${resource} not found`,
    HttpStatus.NOT_FOUND,
    ErrorCode.NOT_FOUND
  );
}

/**
 * Create an unauthorized error
 */
export function createUnauthorizedError(message = 'Authentication required'): AppError {
  return new AppError(
    message,
    HttpStatus.UNAUTHORIZED,
    ErrorCode.UNAUTHORIZED
  );
}

/**
 * Create a forbidden error
 */
export function createForbiddenError(message = 'Permission denied'): AppError {
  return new AppError(
    message,
    HttpStatus.FORBIDDEN,
    ErrorCode.FORBIDDEN
  );
}
