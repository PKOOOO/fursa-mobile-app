import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// POST /api/jobs/:id/apply — apply for a job with CV upload
export async function POST(request, { params }) {
    try {
        const { id } = await params;

        let userId, userName, userEmail, coverLetter, cvUrl;

        // Read body as text for debugging + manual parsing
        const bodyText = await request.text();
        console.log("Apply request body length:", bodyText.length);
        console.log("Apply request body preview:", bodyText.substring(0, 300));

        // Strategy 1: Try JSON
        try {
            const body = JSON.parse(bodyText);
            userId = body.userId;
            userName = body.userName;
            userEmail = body.userEmail;
            coverLetter = body.coverLetter;
            console.log("Parsed as JSON successfully");
        } catch (jsonErr) {
            console.log("JSON parse failed, trying multipart extraction");

            // Strategy 2: Extract from multipart body text using regex
            // Multipart format: --boundary\r\nContent-Disposition: form-data; name="field"\r\n\r\nvalue\r\n
            const extractField = (fieldName) => {
                // Try multiple patterns for different multipart formats
                const patterns = [
                    new RegExp(`name="${fieldName}"\\r\\n\\r\\n([\\s\\S]*?)\\r\\n--`, "m"),
                    new RegExp(`name="${fieldName}"\\n\\n([\\s\\S]*?)\\n--`, "m"),
                    new RegExp(`name="${fieldName}"[\\r\\n]+([^\\r\\n]+)`, "m"),
                ];
                for (const pattern of patterns) {
                    const match = bodyText.match(pattern);
                    if (match && match[1]) {
                        return match[1].trim();
                    }
                }
                return null;
            };

            userId = extractField("userId");
            userName = extractField("userName");
            userEmail = extractField("userEmail");
            coverLetter = extractField("coverLetter");
            console.log("Extracted from multipart:", { userId, userName, userEmail: userEmail ? "yes" : "no" });
        }

        if (!userId || !userName || !userEmail) {
            console.error("Missing fields after parsing. Body was:", bodyText.substring(0, 500));
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
