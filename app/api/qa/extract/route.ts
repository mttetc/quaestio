import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getQAForDateRange } from '@/lib/email/qa-service';
import { hasExtractionQuota } from '@/lib/auth/roles';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emailAccountId, startDate, endDate } = await request.json();

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Check quota before processing
    const hasQuota = await hasExtractionQuota(user.id);
    if (!hasQuota) {
      return NextResponse.json(
        { error: 'Monthly extraction quota exceeded' },
        { status: 403 }
      );
    }

    const results = await getQAForDateRange(user.id, {
      emailAccountId,
      startDate: start,
      endDate: end,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error('QA extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract Q&As' },
      { status: 500 }
    );
  }
}