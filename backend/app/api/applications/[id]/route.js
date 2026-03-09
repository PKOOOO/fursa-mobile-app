import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/applications/:id — get a single application with job details
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          select: {
            title: true,
            company: true,
            location: true,
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { error: "Failed to fetch application" },
      { status: 500 },
    );
  }
}

// PUT /api/applications/:id — update application status
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
      { status: 500 },
    );
  }
}

