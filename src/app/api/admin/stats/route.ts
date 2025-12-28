import { NextRequest, NextResponse } from "next/server";
import { getUsageStats } from "@/lib/firebase";

export async function GET(req: NextRequest) {
    try {
        // Simple password protection via header
        const authHeader = req.headers.get("x-admin-password");
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (!adminPassword) {
            return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
        }

        if (authHeader !== adminPassword) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get stats from Firestore
        const stats = await getUsageStats();

        return NextResponse.json({
            success: true,
            ...stats
        });

    } catch (error: any) {
        console.error("Admin Stats Error:", error);
        return NextResponse.json(
            { error: `Failed to get stats: ${error.message}` },
            { status: 500 }
        );
    }
}
