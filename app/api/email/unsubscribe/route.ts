import { createClient } from "@/services/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        const { data: user, error: userError } = await supabase.auth.getUser();
        if (userError || !user.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ids } = await request.json();
        if (!Array.isArray(ids)) {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        const { error } = await supabase
            .from("email_subscriptions")
            .update({ status: "unsubscribed" })
            .in("id", ids)
            .eq("user_id", user.user.id);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            status: "completed",
            message: "Successfully unsubscribed",
        });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 }
        );
    }
}
