import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { qaEntries } from '@/lib/db/schema';
import { and, avg, between, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Start and end dates are required' },
        { status: 400 }
      );
    }

    const result = await db
      .select({
        averageHours: avg('response_time_hours'),
      })
      .from(qaEntries)
      .where(
        and(
          eq(qaEntries.userId, user.id),
          between(
            qaEntries.createdAt,
            new Date(startDate),
            new Date(endDate)
          )
        )
      );

    return NextResponse.json({
      averageHours: result[0]?.averageHours || 0,
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch response time analytics' },
      { status: 500 }
    );
  }
}