"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Briefcase, CalendarDays, Bell as BellIcon } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    Notification,
} from "@/lib/notification-service";
import { useAuthStore } from "@/store/auth-store";

const typeIcons: Record<string, typeof Briefcase> = {
    STATUS_CHANGE: Briefcase,
    INTERVIEW_SCHEDULED: CalendarDays,
    INTERVIEW_REMINDER: CalendarDays,
    SYSTEM: BellIcon,
};

export function NotificationBell() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);
    const user = useAuthStore((state) => state.user);

    const { data: notifData } = useQuery({
        queryKey: ["notifications"],
        queryFn: getNotifications,
        enabled: !!user,
    });

    const { data: unreadCount } = useQuery({
        queryKey: ["notifications-unread-count"],
        queryFn: getUnreadCount,
        enabled: !!user,
    });
    console.log("unreadCount value:", unreadCount, "user:", user);

    const markReadMutation = useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });

    const markAllReadMutation = useMutation({
        mutationFn: markAllAsRead,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        },
    });

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [open]);

    const handleNotificationClick = (notif: Notification) => {
        if (!notif.read) markReadMutation.mutate(notif.id);
        if (notif.relatedEntityType === "JOB" && notif.relatedEntityId) {
            router.push(`/jobs/${notif.relatedEntityId}`);
        }
        setOpen(false);
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center justify-center h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-container transition relative"
            >
                <Bell className="h-4.5 w-4.5" />
                {!!unreadCount && unreadCount > 0 && (
                    <span className="absolute -top-1 -end-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold leading-none text-on-error">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
                )}
            </button>

            {open && (
                <div
                    className={`absolute top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-lg border border-outline-variant bg-surface-container-lowest shadow-lg z-50 ${
                        dir === "rtl" ? "start-0" : "end-0"
                    }`}
                >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant sticky top-0 bg-surface-container-lowest">
            <span className="text-sm font-semibold text-on-surface">
              {t("notificationsPanel.title")}
            </span>
                        {!!unreadCount && unreadCount > 0 && (
                            <button
                                onClick={() => markAllReadMutation.mutate()}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                {t("notificationsPanel.markAllRead")}
                            </button>
                        )}
                    </div>

                    {!notifData?.content.length ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                            <Bell className="h-8 w-8 text-on-surface-variant mb-2" />
                            <p className="text-sm font-medium text-on-surface">{t("notificationsPanel.empty")}</p>
                            <p className="text-xs text-on-surface-variant mt-1">{t("notificationsPanel.emptyDesc")}</p>
                        </div>
                    ) : (
                        <ul>
                            {notifData.content.map((notif) => {
                                const Icon = typeIcons[notif.type] || BellIcon;
                                return (
                                    <li
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-surface-container transition border-b border-outline-variant last:border-0 ${
                                            !notif.read ? "bg-primary-container/5" : ""
                                        }`}
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-on-surface truncate">{notif.title}</p>
                                            <p className="text-xs text-on-surface-variant line-clamp-2">{notif.message}</p>
                                            <p className="text-xs text-on-surface-variant mt-1">
                                                {new Date(notif.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {!notif.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5" />}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}