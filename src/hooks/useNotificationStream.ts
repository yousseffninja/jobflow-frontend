"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";

export function useNotificationStream() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!accessToken) return;

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/notifications/stream?token=${accessToken}`;
        const eventSource = new EventSource(url);

        eventSource.addEventListener("notification", () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["notifications-unread-count"] });
        });

        eventSource.onerror = () => {
            // EventSource auto-reconnects on transient errors; nothing to do here.
            // If the token itself is invalid/expired, the connection will keep failing —
            // acceptable for now since the access token is short-lived (15 min) and this
            // hook re-runs whenever accessToken changes (e.g. after a refresh).
        };

        return () => {
            eventSource.close();
        };
    }, [accessToken, queryClient]);
}