import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/core/db";
import { users } from "@/lib/core/db/schema";
import { sql } from "drizzle-orm";

export const runtime = "edge";

export async function POST(request: NextRequest) {
    try {
        // Verify the request is from a trusted source (e.g., Vercel Cron)
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Reset monthly usage for users whose last reset was more than a month ago
        const result = await db.execute(sql`
            UPDATE ${users}
            SET monthly_usage = 0,
                last_usage_reset = NOW()
            WHERE last_usage_reset < NOW() - INTERVAL '1 month'
            RETURNING id
        `);

        return NextResponse.json({
            success: true,
            message: "Monthly usage reset completed",
            usersReset: result.length,
        });
    } catch (error) {
        console.error("Error resetting monthly usage:", error);
        return NextResponse.json({ error: "Failed to reset monthly usage" }, { status: 500 });
    }
}
