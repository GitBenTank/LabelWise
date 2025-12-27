import { z } from 'zod';
import { handleApiError } from './errors';

/**
 * Validate request body with Zod schema
 */
export async function validateRequest<T extends z.ZodType>(
  request: Request,
  schema: T
): Promise<z.infer<T>> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    throw error; // Let handleApiError handle it
  }
}

/**
 * Validate query parameters with Zod schema
 */
export function validateQuery<T extends z.ZodType>(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  schema: T
): z.infer<T> {
  const params: Record<string, string> = {};

  if (searchParams instanceof URLSearchParams) {
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
  } else {
    Object.entries(searchParams).forEach(([key, value]) => {
      params[key] = Array.isArray(value) ? value[0] : value || '';
    });
  }

  return schema.parse(params);
}

export { handleApiError };

