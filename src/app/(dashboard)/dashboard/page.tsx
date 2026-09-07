"use client";

import { FileText, TrendingUp, Users, Award, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "@/providers/locale-provider";
import { useAuthStore } from "@/store/auth-store";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { statusColorHex } from "@/components/jobs/StatusBadge";
import {
    getDashboardStats,
    getStatusBreakdown,
    getRecentActivity,
} from "@/lib/dashboard-service";
import { getUpcomingInterviews } from "@/lib/interview-service";

export default function DashboardPage() {
    const { t } = useLocale();
    const user = useAuthStore((state) => state.user);

    const { data: stats } = useQuery({ queryKey: ["dashboard-stats"], queryFn: getDashboardStats });
    const { data: breakdown } = useQuery({
        queryKey: ["dashboard-breakdown"],
        queryFn: getStatusBreakdown,
    });
    const { data: activity } = useQuery({
        queryKey: ["dashboard-activity"],
        queryFn: () => getRecentActivity(5),
    });
    const { data: upcoming } = useQuery({
        queryKey: ["dashboard-upcoming"],
        queryFn: () => getUpcomingInterviews(14),
    });

    const maxStatusCount = Math.max(...(breakdown?.map((s) => s.count) || [1]), 1);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold text-on-surface">
                    {t("dashboard.welcomeBack")}, {user?.fullName?.split(" ")[0] || "..."}
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label={t("dashboard.totalApplications")} value={stats?.totalApplications ?? "..."} icon={FileText} />
                <KpiCard label={t("dashboard.responseRate")} value={stats ? `${stats.responseRate}%` : "..."} icon={TrendingUp} />
                <KpiCard label={t("dashboard.interviewRate")} value={stats ? `${stats.interviewRate}%` : "..."} icon={Users} />
                <KpiCard label={t("dashboard.offerRate")} value={stats ? `${stats.offerRate}%` : "..."} icon={Award} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.statusBreakdown")}</h2>
                    <div className="space-y-3">
                        {breakdown?.map((item) => (
                            <div key={item.status}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-on-surface-variant">{t(`jobs.status.${item.status}`)}</span>
                                    <span className="text-on-surface font-medium">{item.count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{
                                            width: `${(item.count / maxStatusCount) * 100}%`,
                                            backgroundColor: statusColorHex[item.status],
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.recentActivity")}</h2>
                    {!activity?.length ? (
                        <p className="text-sm text-on-surface-variant">{t("dashboard.noActivity")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {activity.map((item, i) => (
                                <li key={i} className="text-sm">
                                    <p className="text-on-surface">
                                        <span className="font-medium">{item.jobTitle}</span>
                                        {" @ "}
                                        {item.companyName}
                                        {" — "}
                                        {item.oldStatus
                                            ? `${t(`jobs.status.${item.oldStatus}`)} → ${t(`jobs.status.${item.newStatus}`)}`
                                            : t("jobDetail.created")}
                                    </p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">
                                        {new Date(item.changedAt).toLocaleString()}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.upcomingInterviews")}</h2>
                    {!upcoming?.length ? (
                        <p className="text-sm text-on-surface-variant">{t("dashboard.noInterviews")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {upcoming.map((iv) => (
                                <li key={iv.id} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">{iv.jobTitle}</p>
                                        <p className="text-xs text-on-surface-variant">
                                            {iv.companyName} · {new Date(iv.scheduledAt).toLocaleString()}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}