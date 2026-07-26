import { DashboardShell } from "@/components/layout/DashboardShell";
import { RequireAuth } from "@/components/layout/RequireAuth";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <RequireAuth>
            <DashboardShell>{children}</DashboardShell>
        </RequireAuth>
    );
}