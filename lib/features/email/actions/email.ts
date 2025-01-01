'use server';

import { getCurrentUser } from "@/lib/core/auth";
import { db } from "@/services/db";
import { emailAccounts } from "@/lib/core/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { encryptAccessToken, decryptAccessToken } from "@/lib/core/encryption";

export interface EmailFormState {
    error?: string;
    success?: boolean;
}

export async function connectEmail(
    prevState: EmailFormState,
    formData: FormData
): Promise<EmailFormState> {
    try {
        const user = await getCurrentUser();
        const email = formData.get('email') as string;
        const accessToken = formData.get('accessToken') as string;
        const provider = formData.get('provider') as string;

        if (!email || !accessToken || !provider) {
            return { error: 'All fields are required' };
        }

        // Check if email is already connected
        const existingAccount = await db.query.emailAccounts.findFirst({
            where: eq(emailAccounts.email, email),
        });

        if (existingAccount) {
            return { error: 'This email is already connected' };
        }

        // Encrypt access token
        const { encryptedData, iv } = encryptAccessToken(accessToken);

        // Create new email account
        await db.insert(emailAccounts).values({
            userId: user.id,
            email,
            encryptedAccessToken: encryptedData,
            encryptionIV: iv,
            provider,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error('Error connecting email:', error);
        return { error: 'Failed to connect email account' };
    }
}

export async function disconnectEmail(
    prevState: EmailFormState,
    formData: FormData
): Promise<EmailFormState> {
    try {
        const accountId = formData.get('accountId') as string;

        if (!accountId) {
            return { error: 'Account ID is required' };
        }

        await db.delete(emailAccounts)
            .where(eq(emailAccounts.id, accountId));

        revalidatePath('/dashboard/settings');
        return { success: true };
    } catch (error) {
        console.error('Error disconnecting email:', error);
        return { error: 'Failed to disconnect email account' };
    }
}

export async function getEmailAccount(id: string) {
    try {
        const user = await getCurrentUser();
        const account = await db.query.emailAccounts.findFirst({
            where: eq(emailAccounts.id, id)
        });

        if (!account || account.userId !== user.id) {
            throw new Error('Email account not found');
        }

        // Decrypt access token before returning
        const accessToken = decryptAccessToken(account.encryptedAccessToken, account.encryptionIV);

        return {
            ...account,
            accessToken
        };
    } catch (error) {
        console.error('Error getting email account:', error);
        throw new Error('Failed to get email account');
    }
}

export async function updateEmailAccount(id: string, accessToken: string) {
    try {
        const { encryptedData, iv } = encryptAccessToken(accessToken);

        const [account] = await db.update(emailAccounts)
            .set({
                encryptedAccessToken: encryptedData,
                encryptionIV: iv,
                updatedAt: new Date()
            })
            .where(eq(emailAccounts.id, id))
            .returning();

        return account;
    } catch (error) {
        console.error('Error updating email account:', error);
        throw new Error('Failed to update email account');
    }
} 