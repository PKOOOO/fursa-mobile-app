"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export default function JobsPage() {
    const { user } = useUser();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (!user?.id) return;
        const fetchJobs = async () => {
            try {
                const res = await fetch(`/api/jobs?createdBy=${user.id}`);
                setJobs(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user?.id]);

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await fetch(`/api/jobs/${deleteId}`, { method: "DELETE" });
            setJobs(jobs.filter((j) => j._id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-6 h-6 border-2 border-border border-t-foreground rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="animate-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Jobs</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {jobs.length} Listing{jobs.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/jobs/new">New listing</Link>
                </Button>
            </div>

            <Card>
                <CardContent className="p-0">
                    {jobs.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="font-medium">No jobs yet</p>
                            <p className="text-sm mt-1">Create your first listing to start receiving applications.</p>
                            <Button asChild variant="outline" size="sm" className="mt-4">
                                <Link href="/dashboard/jobs/new">Create listing</Link>
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Job</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead>Mode</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
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
                                                    <p className="text-xs text-muted-foreground">{job.company}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal text-xs">
                                                {job.type}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{job.location}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{job.salary || "—"}</TableCell>
                                        <TableCell>
                                            <Badge variant={job.remote ? "default" : "outline"} className="font-normal text-xs">
                                                {job.remote ? "Remote" : "On-site"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-1 justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => router.push(`/dashboard/jobs/${job._id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-destructive hover:text-destructive"
                                                    onClick={() => setDeleteId(job._id)}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Delete dialog */}
            <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete this listing?</DialogTitle>
                        <DialogDescription>
                            This will permanently remove the job and all associated applications. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
