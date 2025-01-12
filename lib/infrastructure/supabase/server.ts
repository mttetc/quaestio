import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value;
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set(name, value, {
                        ...options,
                        sameSite: "lax",
                        secure: process.env.NODE_ENV === "production",
                    });
                } catch (error) {
                    // Handle cookies in middleware
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.delete({ name, ...options });
                } catch (error) {
                    // Handle cookies in middleware
                }
            },
        },
    });
}
