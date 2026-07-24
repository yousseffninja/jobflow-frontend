"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

            <div className="flex-1 flex flex-col min-w-0">
                <Topbar onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 p-4 sm:p-6">{children}</main>
            </div>
        </div>
    );
}