import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { EmailContent } from '../types';

function createOAuth2Client(accessToken: string, refreshToken?: string) {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
  );

  client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return client;
}

function createDateQuery(startDate: Date, endDate: Date): string {
  return `after:${startDate.toISOString().split('T')[0]} before:${endDate.toISOString().split('T')[0]}`;
}

async function fetchEmail(gmail: any, messageId: string) {
  const email = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
    format: 'full',
  });

  const content = email.data.payload?.parts?.[0]?.body?.data || '';
  const decodedContent = Buffer.from(content, 'base64').toString('utf-8');

  return {
    id: messageId,
    content: decodedContent,
    metadata: {
      subject: email.data.payload?.headers?.find(h => h.name === 'Subject')?.value,
      date: new Date(Number(email.data.internalDate)),
    },
  };
}

export async function extractGmailEmails(
  accessToken: string,
  refreshToken: string | undefined,
  startDate: Date,
  endDate: Date
): Promise<EmailContent[]> {
  const oauth2Client = createOAuth2Client(accessToken, refreshToken);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
  
  const query = createDateQuery(startDate, endDate);
  
  const response = await gmail.users.messages.list({
    userId: 'me',
    q: query,
  });

  const messages = response.data.messages || [];
  const emailPromises = messages.map(message => 
    fetchEmail(gmail, message.id!)
  );

  return Promise.all(emailPromises);
}