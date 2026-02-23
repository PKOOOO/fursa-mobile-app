"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
    const { user } = useUser();
    const [stats, setStats] = useState(null);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user?.id) return;
        const fetchData = async () => {
            try {
                const [statsRes, jobsRes] = await Promise.all([
                    fetch(`/api/stats?userId=${user.id}`),
                    fetch(`/api/jobs?createdBy=${user.id}`),
                ]);
                const statsData = await statsRes.json();
                const jobsData = await jobsRes.json();
                setStats(statsData);
                setRecentJobs(jobsData.slice(0, 5));
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user?.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
            </div>
        );
    }

    const statCards = [
        { label: "Your Listings", value: stats?.totalJobs || 0, sub: "total jobs posted" },
        { label: "Active", value: stats?.activeJobs || 0, sub: "currently live" },
        { label: "Applications", value: stats?.totalApplications || 0, sub: "received" },
        { label: "Pending", value: stats?.pendingApplications || 0, sub: "awaiting review" },
    ];

    return (
        <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Here&apos;s what&apos;s happening with your job listings.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/jobs/new">New listing</Link>
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                {statCards.map((s) => (
                    <Card key={s.label}>
                        <CardContent className="pt-5 pb-4">
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                {s.label}
                            </p>
                            <p className="text-3xl font-bold mt-1.5">{s.value}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent jobs */}
            <Card>
                <div className="flex items-center justify-between p-5 pb-0">
                    <h2 className="text-sm font-semibold">Recent listings</h2>
                    <Button variant="link" size="sm" asChild className="text-xs">
                        <Link href="/dashboard/jobs">View all</Link>
                    </Button>
                </div>
                <CardContent className="p-0 mt-3">
                    {recentJobs.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="text-sm">No jobs posted yet.</p>
                            <Button asChild variant="outline" size="sm" className="mt-3">
                                <Link href="/dashboard/jobs/new">Post your first job</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead className="text-right">Posted</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentJobs.map((job) => (
                                    <TableRow key={job._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {job.employerLogo ? (
                                                    <img
                                                        src={job.employerLogo}
                                                        alt=""
                                                        className="w-8 h-8 rounded-md object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xs font-semibold">
                                                        {job.company?.[0]}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium">{job.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {job.company}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs">
                                                {job.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {job.location}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={job.remote ? "default" : "outline"}
                                                className="font-normal text-xs"
                                            >
                                                {job.remote ? "Remote" : "On-site"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground">
                                            {new Date(job.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
