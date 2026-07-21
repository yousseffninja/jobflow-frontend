"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

export default function ForgotPasswordPage() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
    const BackArrowIcon = dir === "rtl" ? ArrowRight : ArrowLeft;
    const [email, setEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/verify-reset-code?email=${encodeURIComponent(email)}`);
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
                    {t("auth.forgotPassword.title")}
                </h1>
                <p className="text-sm text-on-surface-variant mb-6">
                    {t("auth.forgotPassword.subtitle")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("auth.forgotPassword.email")}
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={t("auth.forgotPassword.emailPlaceholder")}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition"
                    >
                        {t("auth.forgotPassword.sendCode")}
                        <ArrowIcon className="h-4 w-4" />
                    </button>

                    <div className="border-t border-outline-variant pt-4">
                        <Link
                            href="/login"
                            className="flex items-center justify-center gap-1.5 text-sm text-primary hover:underline"
                        >
                            <BackArrowIcon className="h-3.5 w-3.5" />
                            {t("auth.forgotPassword.backToLogin")}
                        </Link>
                    </div>
                </form>
            </div>

            <p className="text-xs text-on-surface-variant mt-6">
                {t("auth.forgotPassword.trouble")}{" "}
                <Link href="#" className="text-primary hover:underline">
                    {t("auth.forgotPassword.contactSupport")}
                </Link>
            </p>
        </div>
    );
}