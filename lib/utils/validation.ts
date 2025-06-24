import { z } from 'zod';
import { createValidationError } from './error-handler';
import { AppError, ErrorCode, HttpStatus } from './error-handler';

/**
 * Generic validation function using Zod schemas
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @param errorMessage - Custom error message (optional)
 * @returns Validated data
 * @throws AppError with validation details if validation fails
 */
export function validate<T>(
  schema: z.ZodType<T>,
  data: unknown,
  errorMessage = 'Validation failed'
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createValidationError(errorMessage, {
        validationErrors: error.format(),
      });
    }
    throw error;
  }
}

/**
 * Safe validation that returns a result object instead of throwing
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object with success flag and either data or error
 */
export function validateSafe<T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: AppError } {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: createValidationError('Validation failed', {
          validationErrors: error.format(),
        }),
      };
    }
    if (error instanceof AppError) {
      return { success: false, error };
    }
    return {
      success: false,
      error: new AppError(
        'Unexpected validation error',
        HttpStatus.BAD_REQUEST,
        ErrorCode.INVALID_ARGUMENT,
        { originalError: String(error) }
      ),
    };
  }
}

/**
 * Common validation schemas
 */
export const CommonSchemas = {
  // String schemas
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  uuid: z.string().uuid('Invalid UUID format'),
  
  // Number schemas
  positiveNumber: z.number().positive('Must be a positive number'),
  nonNegativeNumber: z.number().nonnegative('Must be zero or a positive number'),
  rating: z.number().min(1).max(5, 'Rating must be between 1 and 5'),
  
  // Date schemas
  pastDate: z.date().refine(date => date < new Date(), 'Date must be in the past'),
  futureDate: z.date().refine(date => date > new Date(), 'Date must be in the future'),
  
  // Object schemas
  pagination: z.object({
    page: z.number().int().positive().optional().default(1),
    limit: z.number().int().positive().max(100).optional().default(10),
  }),
  
  // Geolocation
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
  
  // Common formats
  timeString: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'),
  dateString: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
};

/**
 * Validate request query parameters
 * 
 * @param schema - Zod schema for query parameters
 * @param query - Query parameters to validate
 * @returns Validated query parameters
 */
export function validateQuery<T>(schema: z.ZodType<T>, query: unknown): T {
  return validate(schema, query, 'Invalid query parameters');
}

/**
 * Validate request body
 * 
 * @param schema - Zod schema for request body
 * @param body - Request body to validate
 * @returns Validated request body
 */
export function validateBody<T>(schema: z.ZodType<T>, body: unknown): T {
  return validate(schema, body, 'Invalid request body');
}

/**
 * Validate request parameters (route params)
 * 
 * @param schema - Zod schema for request parameters
 * @param params - Request parameters to validate
 * @returns Validated request parameters
 */
export function validateParams<T>(schema: z.ZodType<T>, params: unknown): T {
  return validate(schema, params, 'Invalid request parameters');
}

/**
 * Create a partial validation schema that makes all properties optional
 * but keeps their validation rules
 * 
 * @param schema - Original Zod object schema
 * @returns New schema with all properties optional
 */
export function createPartialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  const partialSchema: Record<string, any> = {};
  
  Object.keys(schema.shape).forEach((key) => {
    partialSchema[key] = schema.shape[key].optional();
  });
  
  return z.object(partialSchema);
}

/**
 * Create a schema for pagination and sorting
 * 
 * @param sortableFields - Array of field names that can be sorted
 * @returns Zod schema for pagination and sorting
 */
export function createPaginationSchema(sortableFields: string[]) {
  return z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    sortBy: z.enum([...sortableFields] as [string, ...string[]]).optional(),
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  });
}
