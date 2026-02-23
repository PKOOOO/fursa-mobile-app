import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/stats — get dashboard statistics (filtered by user)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        const userFilter = userId ? { createdBy: userId } : {};

        const [totalJobs, activeJobs, totalApplications, pendingApplications] =
            await Promise.all([
                prisma.job.count({ where: userFilter }),
                prisma.job.count({ where: { ...userFilter, isActive: true } }),
                prisma.application.count({
                    where: userId
                        ? { job: { createdBy: userId } }
                        : {},
                }),
                prisma.application.count({
                    where: userId
                        ? { status: "pending", job: { createdBy: userId } }
                        : { status: "pending" },
                }),
            ]);

        return NextResponse.json({ totalJobs, activeJobs, totalApplications, pendingApplications });
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
