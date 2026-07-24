"use client";

import { useLocale } from "@/providers/locale-provider";
import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {
    const { t } = useLocale();
    const user = useAuthStore((state) => state.user);

    return (
        <div>
            <h1 className="font-heading text-2xl font-semibold text-on-surface">
                {t("dashboard.welcomeBack")}, {user?.fullName || "..."}
            </h1>
        </div>
    );
}