"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const JOB_TYPES = ["Full-time", "Part-time", "Contractor", "Hustle", "Home"];

export default function NewJobPage() {
    const router = useRouter();
    const { user } = useUser();
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const fileRef = useRef(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        company: "",
        contactEmail: "",
        location: "Mombasa",
        state: "Kenya",
        type: "Full-time",
        remote: false,
        salary: "",
        duration: "",
        jobIcon: "",
        qualifications: "",
        responsibilities: "",
        expiresAt: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            let employerLogo = "";

            // Upload logo if selected
            if (logoFile) {
                const formData = new FormData();
                formData.append("file", logoFile);
                const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
                if (uploadRes.ok) {
                    const uploadData = await uploadRes.json();
                    employerLogo = uploadData.url;
                }
            }

            const res = await fetch("/api/jobs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...form,
                    employerLogo,
                    createdBy: user?.id || "unknown",
                }),
            });

            if (res.ok) {
                router.push("/dashboard/jobs");
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create job");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create job");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-in max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">New listing</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Fill in the details below to publish a job listing.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g. React Native Developer"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="company">Company</Label>
                                <Input
                                    id="company"
                                    name="company"
                                    value={form.company}
                                    onChange={handleChange}
                                    placeholder="e.g. SwahiliTech Solutions"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="What makes this role exciting? What will they do day-to-day?"
                                className="min-h-[100px]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Job type</Label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v) => setForm((p) => ({ ...p, type: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {JOB_TYPES.map((t) => (
                                            <SelectItem key={t} value={t}>{t}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contactEmail">Contact email</Label>
                                <Input
                                    id="contactEmail"
                                    name="contactEmail"
                                    type="email"
                                    value={form.contactEmail}
                                    onChange={handleChange}
                                    placeholder="hr@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    value={form.location}
                                    onChange={handleChange}
                                    placeholder="e.g. Mombasa"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">Country</Label>
                                <Input
                                    id="state"
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    placeholder="e.g. Kenya"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary</Label>
                                <Input
                                    id="salary"
                                    name="salary"
                                    value={form.salary}
                                    onChange={handleChange}
                                    placeholder="e.g. KES 80,000 - 120,000"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    value={form.duration}
                                    onChange={handleChange}
                                    placeholder="e.g. Permanent, 3 months"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                role="switch"
                                aria-checked={form.remote}
                                onClick={() => setForm((p) => ({ ...p, remote: !p.remote }))}
                                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors ${form.remote ? "bg-primary" : "bg-input"
                                    }`}
                            >
                                <span
                                    className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-sm ring-0 transition-transform mt-0.5 ${form.remote ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                                        }`}
                                />
                            </button>
                            <Label className="text-sm font-normal">Remote position</Label>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="expiresAt">Expires on</Label>
                            <Input
                                id="expiresAt"
                                name="expiresAt"
                                type="date"
                                value={form.expiresAt}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base">Company Logo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            {logoPreview ? (
                                <img
                                    src={logoPreview}
                                    alt="Preview"
                                    className="w-16 h-16 rounded-lg object-cover border"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground text-xs">
                                    Logo
                                </div>
                            )}
                            <div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => fileRef.current?.click()}
                                >
                                    {logoPreview ? "Change" : "Upload logo"}
                                </Button>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG or SVG. Max 2MB.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-base">Requirements</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="qualifications">Qualifications</Label>
                            <Textarea
                                id="qualifications"
                                name="qualifications"
                                value={form.qualifications}
                                onChange={handleChange}
                                placeholder={"• 2+ years experience\n• Bachelor's degree\n• Strong communication skills"}
                                className="min-h-[100px]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="responsibilities">Responsibilities</Label>
                            <Textarea
                                id="responsibilities"
                                name="responsibilities"
                                value={form.responsibilities}
                                onChange={handleChange}
                                placeholder={"• Develop and maintain applications\n• Collaborate with team\n• Write clean code"}
                                className="min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Separator className="my-6" />

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" disabled={saving}>
                        {saving ? "Publishing..." : "Publish listing"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
