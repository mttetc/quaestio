"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { qaEntries } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

interface DocsState {
  error?: string;
  success?: boolean;
  preview?: string;
  title: string;
  description: string;
  selectedQAs: string[];
}

export async function generateDocs(prevState: DocsState, formData: FormData): Promise<DocsState> {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, "", options);
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Not authenticated");
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const selectedQAs = prevState?.selectedQAs || [];

    if (!title) {
      throw new Error("Title is required");
    }

    if (!selectedQAs?.length) {
      throw new Error("Please select at least one Q&A to include");
    }

    // Fetch the selected Q&As from the database
    const qas = await db.select().from(qaEntries).where(
      inArray(qaEntries.id, selectedQAs)
    );

    // For now, just create a simple preview
    const preview = `
      <h1>${title}</h1>
      ${description ? `<p>${description}</p>` : ''}
      <h2>Q&As</h2>
      ${qas.map(qa => `
        <div class="qa-item">
          <h3>Q: ${qa.question}</h3>
          <p>A: ${qa.answer}</p>
        </div>
      `).join('')}
    `;

    revalidatePath("/docs");
    return { 
      error: undefined,
      success: true, 
      preview,
      title,
      description,
      selectedQAs
    };
  } catch (error) {
    return { 
      ...prevState,
      error: error instanceof Error ? error.message : "Failed to generate documentation",
      success: false
    };
  }
} 