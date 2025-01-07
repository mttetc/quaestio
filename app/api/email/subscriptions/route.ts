import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: subscriptions, error } = await supabase
            .from("email_subscriptions")
            .select("*")
            .eq("user_id", user.user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(subscriptions || []);
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
