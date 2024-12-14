import { NextRequest, NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/gmail';

export async function GET() {
  try {
    const url = await getAuthUrl();
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Failed to generate auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to initiate Gmail authentication' },
      { status: 500 }
    );
  }
}