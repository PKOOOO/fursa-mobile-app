import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import prisma from "@/lib/prisma";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Extract public_id from a Cloudinary raw URL
function extractPublicId(url) {
  // e.g. https://res.cloudinary.com/cloud/raw/upload/v123/folder/file.pdf
  const match = url.match(/\/raw\/upload\/(?:v\d+\/)?(.+)$/);
  return match ? match[1] : null;
}

// GET /api/applications/:id — get a single application with job details
export async function GET(_request, { params }) {
  try {
    const { id } = await params;

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

    // Replace stored cvUrl with a signed URL (60-min expiry) to bypass 401
    let cvUrl = application.cvUrl;
    if (cvUrl) {
      const publicId = extractPublicId(cvUrl);
      if (publicId) {
        cvUrl = cloudinary.url(publicId, {
          resource_type: "raw",
          type: "upload",
          sign_url: true,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
        });
      }
    }

    return NextResponse.json({ ...application, cvUrl });
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
      { status: 500 },
    );
  }
}

