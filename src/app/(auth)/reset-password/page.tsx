"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Lock, ShieldCheck, AlertCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { resetPassword } from "@/lib/auth-service";
import { isAxiosError } from "axios";

function ResetPasswordForm() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "";
    const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword({ email, code, newPassword });
            router.push("/login");
        } catch (err) {
            if (isAxiosError(err) && err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background">
            <div className="flex items-center gap-2 mb-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Sparkles className="h-4 w-4 text-on-primary" />
                </div>
            </div>
            <span className="font-heading font-semibold text-on-surface mb-1">
        {t("common.appName")}
      </span>
            <p className="text-xs text-on-surface-variant mb-6 uppercase tracking-wide">
                ATS Intelligence
            </p>

            <div className="w-full max-w-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
                <h1 className="font-heading text-xl font-semibold text-on-surface mb-1">
                    {t("auth.resetPassword.title")}
                </h1>
                <p className="text-sm text-on-surface-variant mb-6">
                    Set a new password for{" "}
                    <span className="text-on-surface font-medium">{email}</span>
                </p>

                {error && (
                    <div className="flex items-center gap-2 rounded-md bg-error-container text-on-error-container px-3 py-2.5 text-sm mb-4">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wide text-on-surface-variant mb-1.5">
                            {t("auth.resetPassword.newPassword")}
                        </label>
                        <div className="relative">
                            <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                            <input
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wide text-on-surface-variant mb-1.5">
                            {t("auth.resetPassword.confirmPassword")}
                        </label>
                        <div className="relative">
                            <ShieldCheck className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {isLoading ? "..." : t("auth.resetPassword.resetButton")}
                        {!isLoading && <ArrowIcon className="h-4 w-4" />}
                    </button>
                </form>

                <div className="text-center mt-4">
                    <Link href="/login" className="text-sm text-primary hover:underline">
                        {t("auth.resetPassword.backToLogin")}
                    </Link>
                </div>
            </div>

            <p className="text-xs text-on-surface-variant/60 mt-6">
                {t("auth.resetPassword.footer")}
            </p>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={null}>
            <ResetPasswordForm />
        </Suspense>
    );
}