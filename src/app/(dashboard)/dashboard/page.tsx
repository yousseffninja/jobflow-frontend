"use client";

import { FileText, TrendingUp, Users, Award, Clock } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { useAuthStore } from "@/store/auth-store";
import { KpiCard } from "@/components/dashboard/KpiCard";
import {
    mockKpis,
    mockStatusBreakdown,
    mockRecentActivity,
    mockUpcomingInterviews,
} from "@/lib/mock-dashboard-data";

export default function DashboardPage() {
    const { t } = useLocale();
    const user = useAuthStore((state) => state.user);

    const maxStatusCount = Math.max(...mockStatusBreakdown.map((s) => s.count));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-heading text-2xl font-semibold text-on-surface">
                    {t("dashboard.welcomeBack")}, {user?.fullName?.split(" ")[0] || "..."}
                </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label={t("dashboard.totalApplications")} value={mockKpis.totalApplications} icon={FileText} />
                <KpiCard label={t("dashboard.responseRate")} value={`${mockKpis.responseRate}%`} icon={TrendingUp} />
                <KpiCard label={t("dashboard.interviewRate")} value={`${mockKpis.interviewRate}%`} icon={Users} />
                <KpiCard label={t("dashboard.offerRate")} value={`${mockKpis.offerRate}%`} icon={Award} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.statusBreakdown")}</h2>
                    <div className="space-y-3">
                        {mockStatusBreakdown.map((item) => (
                            <div key={item.status}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                    <span className="text-on-surface-variant">{item.status}</span>
                                    <span className="text-on-surface font-medium">{item.count}</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{ width: `${(item.count / maxStatusCount) * 100}%`, backgroundColor: item.color }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.recentActivity")}</h2>
                    {mockRecentActivity.length === 0 ? (
                        <p className="text-sm text-on-surface-variant">{t("dashboard.noActivity")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {mockRecentActivity.map((activity) => (
                                <li key={activity.id} className="text-sm">
                                    <p className="text-on-surface">{activity.text}</p>
                                    <p className="text-xs text-on-surface-variant mt-0.5">{activity.time}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="lg:col-span-1 rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("dashboard.upcomingInterviews")}</h2>
                    {mockUpcomingInterviews.length === 0 ? (
                        <p className="text-sm text-on-surface-variant">{t("dashboard.noInterviews")}</p>
                    ) : (
                        <ul className="space-y-3">
                            {mockUpcomingInterviews.map((interview) => (
                                <li key={interview.id} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-on-surface">{interview.jobTitle}</p>
                                        <p className="text-xs text-on-surface-variant">{interview.company} · {interview.date}, {interview.time}</p>
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