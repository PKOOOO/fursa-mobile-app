import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PUT /api/applications/:id — update application status
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const application = await prisma.application.update({
            where: { id },
            data: { status: body.status },
        });

        return NextResponse.json(application);
    } catch (error) {
        console.error("Error updating application:", error);
        return NextResponse.json(
            { error: "Failed to update application" },
            { status: 500 }
        );
    }
}
