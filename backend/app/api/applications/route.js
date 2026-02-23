import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/applications — list all applications (with optional filters)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");
        const jobId = searchParams.get("jobId");
        const userId = searchParams.get("userId");
        const ownerId = searchParams.get("ownerId");

        const where = {};
        if (status) where.status = status;
        if (jobId) where.jobId = jobId;
        if (userId) where.userId = userId;

        // Filter by job owner (for dashboard)
        if (ownerId) {
            where.job = { createdBy: ownerId };
        }

        const applications = await prisma.application.findMany({
            where,
            include: {
                job: {
                    select: {
                        title: true,
                        company: true,
                        location: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Error fetching applications:", error);
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
