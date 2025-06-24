import { createClient } from '@supabase/supabase-js';
import { handleDatabaseError } from './error-handler';
import { memoize } from './performance';

/**
 * Type-safe wrapper for database operations with consistent error handling
 */

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a memoized supabase client factory to avoid multiple instantiations
const createSupabaseClient = memoize(() => {
  return createClient(supabaseUrl, supabaseAnonKey);
});

/**
 * Get a supabase client instance
 * @returns Supabase client
 */
export function getSupabaseClient() {
  return createSupabaseClient();
}

/**
 * Execute a database query with proper error handling
 * 
 * @param queryFn - Function that executes the database query
 * @returns Result of the query
 * @throws AppError with appropriate error details
 */
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await queryFn();
    
    if (error) {
      throw handleDatabaseError(error);
    }
    
    if (data === null) {
      throw handleDatabaseError({ code: 'PGRST116' });
    }
    
    return data;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

/**
 * Execute a database mutation with proper error handling
 * 
 * @param mutationFn - Function that executes the database mutation
 * @returns Result of the mutation
 * @throws AppError with appropriate error details
 */
export async function executeMutation<T>(
  mutationFn: () => Promise<{ data: T | null; error: any }>
): Promise<T> {
  try {
    const { data, error } = await mutationFn();
    
    if (error) {
      throw handleDatabaseError(error);
    }
    
    if (data === null) {
      throw handleDatabaseError({ message: 'Mutation returned no data' });
    }
    
    return data;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

/**
 * Execute a database transaction with proper error handling
 * 
 * @param transactionFn - Function that executes multiple database operations
 * @returns Result of the transaction
 * @throws AppError with appropriate error details
 */
export async function executeTransaction<T>(
  transactionFn: (client: ReturnType<typeof getSupabaseClient>) => Promise<T>
): Promise<T> {
  const supabase = getSupabaseClient();
  
  try {
    return await transactionFn(supabase);
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

/**
 * Helper to build pagination parameters for database queries
 * 
 * @param page - Page number (1-based)
 * @param limit - Number of items per page
 * @returns Object with range parameters for Supabase
 */
export function getPaginationRange(page: number = 1, limit: number = 10) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { from, to };
}

/**
 * Helper to build sorting parameters for database queries
 * 
 * @param column - Column to sort by
 * @param ascending - Sort direction (true for ascending, false for descending)
 * @returns Sorting configuration for Supabase
 */
export function getSortingConfig(column: string, ascending: boolean = true) {
  return { ascending, column };
}

/**
 * Check if a record exists in the database
 * 
 * @param table - Table name
 * @param column - Column name
 * @param value - Value to check
 * @returns Boolean indicating if record exists
 */
export async function recordExists(
  table: string,
  column: string,
  value: string | number
): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  try {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true })
      .eq(column, value);
    
    if (error) {
      throw handleDatabaseError(error);
    }
    
    return count !== null && count > 0;
  } catch (error) {
    throw handleDatabaseError(error);
  }
}

/**
 * Get a single record by ID with type safety
 * 
 * @param table - Table name
 * @param id - Record ID
 * @returns The requested record
 * @throws AppError if record not found or other database error
 */
export async function getRecordById<T>(table: string, id: string): Promise<T> {
  const supabase = getSupabaseClient();
  
  return executeQuery<T>(async () => {
    const result = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    return result;
  });
}

/**
 * Insert a record with type safety
 * 
 * @param table - Table name
 * @param data - Record data
 * @returns The inserted record
 * @throws AppError if insertion fails
 */
export async function insertRecord<T>(table: string, data: Partial<T>): Promise<T> {
  const supabase = getSupabaseClient();
  
  return executeMutation<T>(async () => {
    const result = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
    return result;
  });
}

/**
 * Update a record with type safety
 * 
 * @param table - Table name
 * @param id - Record ID
 * @param data - Record data
 * @returns The updated record
 * @throws AppError if update fails
 */
export async function updateRecord<T>(
  table: string,
  id: string,
  data: Partial<T>
): Promise<T> {
  const supabase = getSupabaseClient();
  
  return executeMutation<T>(async () => {
    const result = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    return result;
  });
}

/**
 * Delete a record with type safety
 * 
 * @param table - Table name
 * @param id - Record ID
 * @returns The deleted record
 * @throws AppError if deletion fails
 */
export async function deleteRecord<T>(table: string, id: string): Promise<T> {
  const supabase = getSupabaseClient();
  
  return executeMutation<T>(async () => {
    const result = await supabase
      .from(table)
      .delete()
      .eq('id', id)
      .select()
      .single();
    return result;
  });
}

/**
 * Get multiple records with filtering, pagination and sorting
 * 
 * @param table - Table name
 * @param options - Query options
 * @returns Array of records and count
 * @throws AppError if query fails
 */
export async function getRecords<T>(
  table: string,
  options: {
    filters?: Record<string, any>;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    select?: string;
  } = {}
): Promise<{ data: T[]; count: number }> {
  const supabase = getSupabaseClient();
  const {
    filters = {},
    page = 1,
    limit = 10,
    sortBy,
    sortOrder = 'asc',
    select = '*'
  } = options;
  
  try {
    // Start building the query
    let query = supabase
      .from(table)
      .select(select, { count: 'exact' });
    
    // Apply filters
    Object.entries(filters).forEach(([column, value]) => {
      if (Array.isArray(value)) {
        query = query.in(column, value);
      } else if (value === null) {
        query = query.is(column, null);
      } else {
        query = query.eq(column, value);
      }
    });
    
    // Apply sorting
    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    }
    
    // Apply pagination
    const { from, to } = getPaginationRange(page, limit);
    query = query.range(from, to);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      throw handleDatabaseError(error);
    }
    
    return {
      data: data as T[],
      count: count || 0
    };
  } catch (error) {
    throw handleDatabaseError(error);
  }
}
