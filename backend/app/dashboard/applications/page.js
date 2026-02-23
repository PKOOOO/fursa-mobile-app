"use client";

import { useEffect, useState } from "react";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS = ["pending", "reviewed", "accepted", "rejected"];

const statusVariant = {
    pending: "outline",
    reviewed: "secondary",
    accepted: "default",
    rejected: "destructive",
};

export default function ApplicationsPage() {
    const { user } = useUser();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        if (!user?.id) return;
        const fetchApps = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (filter !== "all") params.set("status", filter);
                params.set("ownerId", user.id);
                const res = await fetch(`/api/applications?${params.toString()}`);
                setApplications(await res.json());
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, [filter, user?.id]);

    const updateStatus = async (appId, newStatus) => {
        try {
            const res = await fetch(`/api/applications/${appId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === appId ? { ...app, status: newStatus } : app
                    )
                );
            }
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
                    <h1 className="text-2xl font-bold tracking-tight">Applications</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {applications.length} application{applications.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <div className="flex gap-1.5">
                    {["all", ...STATUS_OPTIONS].map((s) => (
                        <Button
                            key={s}
                            variant={filter === s ? "default" : "outline"}
                            size="sm"
                            className="text-xs capitalize"
                            onClick={() => setFilter(s)}
                        >
                            {s}
                        </Button>
                    ))}
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    {applications.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <p className="text-4xl mb-3">📋</p>
                            <p className="font-medium">No applications yet</p>
                            <p className="text-sm mt-1">
                                Applications from mobile users will show up here.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Applicant</TableHead>
                                    <TableHead>Job</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Applied</TableHead>
                                    <TableHead>CV</TableHead>
                                    <TableHead className="text-right">Update</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {applications.map((app) => (
                                    <TableRow key={app.id}>
                                        <TableCell>
                                            <div>
                                                <p className="text-sm font-medium">{app.userName}</p>
                                                <p className="text-xs text-muted-foreground">{app.userEmail}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">{app.job?.title || "—"}</p>
                                            <p className="text-xs text-muted-foreground">{app.job?.company || ""}</p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={statusVariant[app.status] || "outline"} className="capitalize text-xs">
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            {app.cvUrl ? (
                                                <a href={app.cvUrl} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                                                    View CV
                                                </a>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Select value={app.status} onValueChange={(v) => updateStatus(app.id, v)}>
                                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {STATUS_OPTIONS.map((s) => (
                                                        <SelectItem key={s} value={s} className="capitalize text-xs">
                                                            {s}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
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
