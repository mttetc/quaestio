import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getSolutionsForQA } from '@/lib/solution/solution-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const solutions = await getSolutionsForQA(params.id);
    return NextResponse.json(solutions);
  } catch (error) {
    console.error('Failed to generate solutions:', error);
    return NextResponse.json(
      { error: 'Failed to generate solutions' },
      { status: 500 }
    );
  }
}