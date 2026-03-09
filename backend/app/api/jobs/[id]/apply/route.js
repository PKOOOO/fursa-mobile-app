import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/jobs/:id/apply — apply for a job with optional CV upload
export async function POST(request, { params }) {
    try {
        const { id } = await params;

        let userId, userName, userEmail, coverLetter, cvUrl;

        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            const body = await request.json();
            userId = body.userId;
            userName = body.userName;
            userEmail = body.userEmail;
            coverLetter = body.coverLetter;
        } else {
            // multipart/form-data (from mobile app with CV file)
            const formData = await request.formData();
            userId = formData.get("userId");
            userName = formData.get("userName");
            userEmail = formData.get("userEmail");
            coverLetter = formData.get("coverLetter");

            const cvFile = formData.get("cv");
            if (cvFile && cvFile instanceof File && cvFile.size > 0) {
                // For now, skip file storage — you can add cloud upload later
                console.log("CV file received:", cvFile.name, cvFile.size, "bytes");
            }
        }

        if (!userId || !userName || !userEmail) {
            return NextResponse.json(
                { error: "Missing required fields: userId, userName, userEmail" },
                { status: 400 }
            );
        }

        const job = await prisma.job.findUnique({ where: { id } });
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        const existing = await prisma.application.findUnique({
            where: { jobId_userId: { jobId: id, userId } },
        });

        if (existing) {
            return NextResponse.json(
                { error: "You have already applied for this job" },
                { status: 409 }
            );
        }

        const application = await prisma.application.create({
            data: {
                jobId: id,
                userId,
                userName,
                userEmail,
                coverLetter: coverLetter || null,
                cvUrl: cvUrl || null,
            },
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        console.error("Error applying for job:", error);
        return NextResponse.json({ error: "Failed to apply for job" }, { status: 500 });
    }
}
