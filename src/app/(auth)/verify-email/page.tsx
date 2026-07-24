"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { CodeInput } from "@/components/auth/CodeInput";
import { confirmEmail } from "@/lib/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { isAxiosError } from "axios";

export default function VerifyEmailPage() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

    const [code, setCode] = useState<string[]>(Array(6).fill(""));
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!user?.email) {
            setError("Session expired. Please log in again.");
            return;
        }

        setIsLoading(true);
        try {
            await confirmEmail({ email: user.email, code: code.join("") });
            router.push("/dashboard");
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Invalid code. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
            <div className="flex items-center gap-2 mb-6">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="h-4 w-4 text-on-primary" />
                </div>
                <span className="font-heading font-semibold text-on-surface">
          {t("common.appName")}
        </span>
            </div>

            <div className="w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                <h1 className="font-heading text-xl font-semibold text-on-surface mb-1">
                    {t("auth.verifyEmail.title")}
                </h1>
                <p className="text-sm text-on-surface-variant mb-6">
                    {t("auth.verifyEmail.subtitle")}
                </p>

                {error && (
                    <div className="flex items-center gap-2 rounded-md bg-error-container text-on-error-container px-3 py-2.5 text-sm mb-4">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <CodeInput value={code} onChange={setCode} />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {isLoading ? "..." : t("auth.verifyEmail.verify")}
                        {!isLoading && <ArrowIcon className="h-4 w-4" />}
                    </button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-on-surface-variant">
                            {t("auth.verifyEmail.noCode")}{" "}
                            <button type="button" className="text-primary hover:underline font-medium">
                                {t("auth.verifyEmail.resend")}
                            </button>
                        </p>
                        <Link
                            href="/dashboard"
                            className="block text-sm text-on-surface-variant hover:underline"
                        >
                            {t("auth.verifyEmail.skipForNow")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}