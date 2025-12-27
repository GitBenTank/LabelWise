import { NextRequest } from 'next/server';
import { userProfileSchema } from '@labelwise/shared';
import { validateRequest } from '@/lib/api/validation';
import { handleApiError } from '@/lib/api/errors';
import { createServerClient } from '@/lib/supabase/server';

/**
 * GET /api/profiles
 * Get current user's profile
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Implement profile fetching in Phase C
    return Response.json({
      allergens: [],
      dietPreferences: [],
      avoidList: [],
      severity: 'moderate' as const,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PUT /api/profiles
 * Update current user's profile
 */
export async function PUT(request: NextRequest) {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await validateRequest(request, userProfileSchema);

    // TODO: Implement profile update in Phase C
    return Response.json(body);
  } catch (error) {
    return handleApiError(error);
  }
}

