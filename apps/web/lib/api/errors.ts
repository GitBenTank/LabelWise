import { apiErrorSchema } from '@labelwise/shared';
import { z } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return apiErrorSchema.parse({
      error: this.name,
      message: this.message,
      code: this.code,
    });
  }
}

export function handleApiError(error: unknown): Response {
  if (error instanceof ApiError) {
    return Response.json(error.toJSON(), { status: error.statusCode });
  }

  if (error instanceof z.ZodError) {
    return Response.json(
      {
        error: 'ValidationError',
        message: 'Invalid request data',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Handle Error instances with helpful messages
  if (error instanceof Error) {
    console.error('API error:', error.message, error.stack);
    
    // Check for common configuration errors
    if (error.message.includes('SUPABASE') || error.message.includes('Supabase')) {
      return Response.json(
        {
          error: 'ConfigurationError',
          message: error.message,
        },
        { status: 500 }
      );
    }
    
    // Check for database errors
    if (error.message.includes('DATABASE') || error.message.includes('database')) {
      return Response.json(
        {
          error: 'DatabaseError',
          message: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        error: 'InternalServerError',
        message: error.message || 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }

  console.error('Unhandled API error:', error);
  return Response.json(
    {
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

