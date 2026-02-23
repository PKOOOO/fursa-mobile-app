import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/jobs/:id — get single job details
export async function GET(request, { params }) {
    try {
        const { id } = await params;

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { applications: true },
                },
            },
        });

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json({
            ...job,
            _id: job.id,
            employer_logo: job.employerLogo,
            applicationCount: job._count.applications,
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        return NextResponse.json(
            { error: "Failed to fetch job" },
            { status: 500 }
        );
    }
}

// PUT /api/jobs/:id — update a job
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const job = await prisma.job.update({
            where: { id },
            data: {
                ...body,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
            },
        });

        return NextResponse.json({ ...job, _id: job.id });
    } catch (error) {
        console.error("Error updating job:", error);
        return NextResponse.json(
            { error: "Failed to update job" },
            { status: 500 }
        );
    }
}

// DELETE /api/jobs/:id — delete a job
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;

        await prisma.job.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json(
            { error: "Failed to delete job" },
            { status: 500 }
        );
    }
}
