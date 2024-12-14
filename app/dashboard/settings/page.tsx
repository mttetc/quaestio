import { EmailLinkForm } from "@/components/settings/email-link-form";
import { LinkedEmails } from "@/components/settings/linked-emails";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { emailAccounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  const linkedEmails = user ? await db.query.emailAccounts.findMany({
    where: eq(emailAccounts.userId, user.id),
  }) : [];

  async function deleteEmail(emailId: string) {
    "use server";
    if (!user) return;
    
    await db.delete(emailAccounts)
      .where(eq(emailAccounts.id, emailId))
      .where(eq(emailAccounts.userId, user.id));
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Email Settings</h2>
        <p className="text-muted-foreground">
          Connect your email accounts to start extracting Q&As
        </p>
      </div>
      
      <LinkedEmails 
        emails={linkedEmails} 
        onDelete={deleteEmail}
      />
      
      <EmailLinkForm />
    </div>
  );
}