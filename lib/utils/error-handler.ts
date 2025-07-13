export class AppError extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code?: string,
  ) {
    super(message)
    this.name = "AppError"
  }
}

export function handleDatabaseError(error: any): AppError {
  console.error("Database error:", error)

  // Supabase specific errors
  if (error.code === "23505") {
    return new AppError("This record already exists", 409, "DUPLICATE_RECORD")
  }

  if (error.code === "23503") {
    return new AppError("Referenced record not found", 404, "FOREIGN_KEY_VIOLATION")
  }

  if (error.code === "PGRST116") {
    return new AppError("No rows found", 404, "NOT_FOUND")
  }

  // Auth errors
  if (error.message?.includes("JWT")) {
    return new AppError("Authentication required", 401, "AUTH_REQUIRED")
  }

  // Generic error
  return new AppError("An unexpected error occurred", 500, "INTERNAL_ERROR")
}

export function handleApiError(error: AppError) {
  return Response.json(
    {
      error: error.message,
      code: error.code,
    },
    { status: error.statusCode },
  )
}
