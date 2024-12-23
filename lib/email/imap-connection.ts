import { ImapFlow } from 'imapflow';
import { decryptPassword } from './encryption';
import { simpleParser } from 'mailparser';

export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string;
  date: Date;
  text: string;
  html?: string;
}

export async function createImapConnection(password: string, email: string, isEncrypted: boolean = false) {
  let finalPassword = password;
  
  if (isEncrypted) {
    try {
      const [encrypted, ivAndTag] = password.split('|');
      const [iv, tag] = ivAndTag.split(':');
      finalPassword = decryptPassword(encrypted, iv, tag);
    } catch (error) {
      console.error('Failed to decrypt password:', error);
      throw new Error('Invalid password format');
    }
  }

  return new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: finalPassword
    },
    logger: false,
    emitLogs: false,
    tls: {
      rejectUnauthorized: true,
      servername: 'imap.gmail.com'
    }
  });
}

export async function testConnection(client: ImapFlow): Promise<boolean> {
  try {
    await client.connect();
    await client.list(); // Test mailbox listing
    await client.logout();
    return true;
  } catch (error) {
    console.error('IMAP connection test failed:', error);
    return false;
  }
}

export async function getEmailsByDateRange(email: string, password: string, startDate: Date, endDate: Date): Promise<Email[]> {
  const client = new ImapFlow({
    host: 'imap.gmail.com',
    port: 993,
    secure: true,
    auth: {
      user: email,
      pass: password
    }
  });

  try {
    await client.connect();
    let lock = await client.getMailboxLock('INBOX');

    try {
      const results: Email[] = [];
      for await (let message of client.fetch({
        since: startDate,
        before: endDate
      }, {
        source: true,
        uid: true
      })) {
        const parsed = await simpleParser(message.source);
        results.push({
          id: message.uid.toString(),
          subject: parsed.subject || '',
          from: parsed.from?.text || '',
          to: Array.isArray(parsed.to) ? parsed.to.map(t => t.text).join(', ') : parsed.to?.text || '',
          date: parsed.date || new Date(),
          text: parsed.text || '',
          html: parsed.html || undefined
        });
      }
      return results;
    } finally {
      lock.release();
    }
  } finally {
    await client.logout();
  }
}