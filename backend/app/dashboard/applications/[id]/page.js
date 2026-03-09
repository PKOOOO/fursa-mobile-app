'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusVariant = {
  pending: "outline",
  reviewed: "secondary",
  accepted: "default",
  rejected: "destructive",
};

export default function ApplicationDetailPage() {
  const { id } = useParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Missing application id in URL.");
      setLoading(false);
      return;
    }

    const fetchApplication = async () => {
      try {
        const res = await fetch(`/api/applications/${id}`);
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.error || "Failed to load application");
        }
        const data = await res.json();
        setApplication(data);
      } catch (err) {
        console.error(err);
        setError(err.message || "Could not load application details.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Application details
          </h1>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/applications">Back to applications</Link>
          </Button>
        </div>
        <p className="text-sm text-destructive">
          {error || "Application not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Application details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submitted on{" "}
            {new Date(application.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={statusVariant[application.status] ?? "outline"}
            className="capitalize"
          >
            {application.status}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/applications">Back to applications</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-medium">{application.userName}</p>
              <p className="text-muted-foreground">{application.userEmail}</p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                User ID
              </p>
              <p className="font-mono text-xs break-all">
                {application.userId}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-medium">
                {application.job?.title ?? "Job no longer available"}
              </p>
              {application.job?.company && (
                <p className="text-muted-foreground">
                  {application.job.company}
                  {application.job.location
                    ? ` • ${application.job.location}`
                    : ""}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cover letter</CardTitle>
        </CardHeader>
        <CardContent>
          {application.coverLetter ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {application.coverLetter}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              This applicant did not include a cover letter.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CV</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          {application.cvUrl ? (
            <>
              <p className="text-sm text-muted-foreground truncate">
                {application.cvUrl}
              </p>
              <Button asChild size="sm">
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open CV
                </a>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No CV was uploaded for this application.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
