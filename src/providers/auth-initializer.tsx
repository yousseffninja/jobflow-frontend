"use client";

import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";
import { useNotificationStream } from "@/hooks/useNotificationStream";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
    const [isReady, setIsReady] = useState(false);
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);
    const hasRun = useRef(false);

    useNotificationStream();

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        async function tryRestoreSession() {
            try {
                const { data } = await apiClient.post("/api/v1/auth/refresh");
                setAuth(data.data.user, data.data.accessToken);
            } catch {
                logout();
            } finally {
                setIsReady(true);
            }
        }
        tryRestoreSession();
    }, [setAuth, logout]);

    if (!isReady) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return <>{children}</>;
}