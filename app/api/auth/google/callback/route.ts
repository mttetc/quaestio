import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { oauth2Client } from '@/lib/gmail';
import { db } from '@/lib/db';
import { emailAccounts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      throw new Error('No code provided');
    }

    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token) {
      throw new Error('No access token received');
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    // Get user info from Gmail
    oauth2Client.setCredentials(tokens);
    const gmail = await google.gmail({ version: 'v1', auth: oauth2Client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    // Store email account
    await db.insert(emailAccounts).values({
      userId: user.id,
      email: profile.data.emailAddress!,
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || null,
      provider: 'gmail',
    }).onConflictDoUpdate({
      target: [emailAccounts.email],
      set: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || null,
      },
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?success=true`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?error=true`
    );
  }
}