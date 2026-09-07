"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/store/auth-store";

function OAuthCallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAccessToken = useAuthStore((state) => state.setAccessToken);
    const setAuth = useAuthStore((state) => state.setAuth);

    useEffect(() => {
        const accessToken = searchParams.get("accessToken");

        if (!accessToken) {
            router.replace("/login");
            return;
        }

        setAccessToken(accessToken);

        apiClient
            .get("/api/v1/dashboard/stats") // any authenticated endpoint works as a token check
            .then(() => {
                apiClient.post("/api/v1/auth/refresh").then(({ data }) => {
                    setAuth(data.data.user, data.data.accessToken);
                    router.replace("/dashboard");
                });
            })
            .catch(() => {
                router.replace("/login");
            });
    }, [searchParams, router, setAccessToken, setAuth]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
    );
}

export default function OAuthCallbackPage() {
    return (
        <Suspense fallback={null}>
            <OAuthCallbackHandler />
        </Suspense>
    );
}