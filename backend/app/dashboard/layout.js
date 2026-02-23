"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();

    const navItems = [
        { href: "/dashboard", label: "Overview", icon: "◉" },
        { href: "/dashboard/jobs", label: "My Jobs", icon: "▤" },
        { href: "/dashboard/jobs/new", label: "New Listing", icon: "+" },
        { href: "/dashboard/applications", label: "Applications", icon: "◫" },
    ];

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    };

    return (
        <div className="flex min-h-screen bg-muted/30">
            {/* Sidebar */}
            <aside className="w-60 border-r bg-sidebar-background fixed top-0 left-0 h-screen flex flex-col">
                <div className="p-5">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <span className="text-xl font-bold tracking-tight">fursa</span>
                    </Link>
                </div>

                <Separator />

                <nav className="flex-1 p-3 space-y-0.5">
                    {navItems.map((item) => {
                        const isActive =
                            item.href === "/dashboard"
                                ? pathname === "/dashboard"
                                : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                                    }`}
                            >
                                <span className="text-base w-5 text-center opacity-60">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-3 mt-auto">
                    <Separator className="mb-3" />
                    <div className="flex items-center gap-2.5 px-3 py-2">
                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                            {user?.firstName?.[0] || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">
                                {user?.fullName || "User"}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {user?.primaryEmailAddress?.emailAddress || ""}
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs text-muted-foreground mt-1"
                        onClick={handleSignOut}
                    >
                        Sign out
                    </Button>
                </div>
            </aside>

            {/* Main */}
            <main className="flex-1 ml-60 p-8 max-w-6xl">{children}</main>
        </div>
    );
}
