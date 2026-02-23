import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/jobs — list all active jobs with optional filters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get("type");
        const search = searchParams.get("search");
        const location = searchParams.get("location");
        const createdBy = searchParams.get("createdBy");

        const where = { isActive: true };

        // Filter by creator (for dashboard)
        if (createdBy) {
            where.createdBy = createdBy;
            delete where.isActive; // Show all jobs for the owner
        }

        if (type && type !== "all") {
            where.type = type;
        }

        if (location) {
            where.location = { contains: location, mode: "insensitive" };
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { company: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
            ];
        }

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                company: true,
                contactEmail: true,
                location: true,
                state: true,
                type: true,
                remote: true,
                salary: true,
                duration: true,
                employerLogo: true,
                jobIcon: true,
                qualifications: true,
                responsibilities: true,
                isActive: true,
                createdAt: true,
                expiresAt: true,
            },
        });

        const mapped = jobs.map((job) => ({
            ...job,
            _id: job.id,
            employer_logo: job.employerLogo,
        }));

        return NextResponse.json(mapped);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

// POST /api/jobs — create a new job
export async function POST(request) {
    try {
        const body = await request.json();

        const { title, description, company, contactEmail, location, state, type, remote, salary, duration, employerLogo, jobIcon, qualifications, responsibilities, expiresAt, createdBy } = body;

        if (!title || !description || !company || !contactEmail || !location || !type) {
            return NextResponse.json(
                { error: "Missing required fields: title, description, company, contactEmail, location, type" },
                { status: 400 }
            );
        }

        const job = await prisma.job.create({
            data: {
                title, description, company, contactEmail, location,
                state: state || null, type, remote: remote || false,
                salary: salary || null, duration: duration || null,
                employerLogo: employerLogo || null, jobIcon: jobIcon || null,
                qualifications: qualifications || null, responsibilities: responsibilities || null,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                createdBy: createdBy || "system",
            },
        });

        return NextResponse.json({ ...job, _id: job.id }, { status: 201 });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
