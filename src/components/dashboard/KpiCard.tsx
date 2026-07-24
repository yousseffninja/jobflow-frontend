import { LucideIcon } from "lucide-react";

type KpiCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
};

export function KpiCard({ label, value, icon: Icon }: KpiCardProps) {
    return (
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-on-surface-variant">{label}</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-container/15 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </div>
            <p className="text-2xl font-semibold text-on-surface">{value}</p>
        </div>
    );
}