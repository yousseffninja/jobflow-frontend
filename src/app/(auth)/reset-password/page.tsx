"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles, Lock, ShieldCheck } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

function ResetPasswordForm() {
    const { t, dir } = useLocale();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const code = searchParams.get("code") || "";
    const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
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
                    Set a new password for <span className="text-on-surface font-medium">{email}</span>
                </p>

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
                                placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition"
                    >
                        {t("auth.resetPassword.resetButton")}
                        <ArrowIcon className="h-4 w-4" />
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