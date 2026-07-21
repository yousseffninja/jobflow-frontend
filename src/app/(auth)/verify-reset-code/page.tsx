"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { CodeInput } from "@/components/auth/CodeInput";

function VerifyResetCodeForm() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";
    const ArrowIcon = dir === "rtl" ? ArrowLeft : ArrowRight;
    const [code, setCode] = useState<string[]>(Array(6).fill(""));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullCode = code.join("");
        router.push(
            `/reset-password?email=${encodeURIComponent(email)}&code=${fullCode}`
        );
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
                    {t("auth.verifyResetCode.title")}
                </h1>
                <p className="text-sm text-on-surface-variant mb-6">
                    {t("auth.verifyResetCode.subtitle")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <CodeInput value={code} onChange={setCode} />

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition"
                    >
                        {t("auth.verifyResetCode.verify")}
                        <ArrowIcon className="h-4 w-4" />
                    </button>

                    <div className="text-center space-y-2">
                        <p className="text-sm text-on-surface-variant">
                            {t("auth.verifyResetCode.noCode")}{" "}
                            <button type="button" className="text-primary hover:underline font-medium">
                                {t("auth.verifyResetCode.resend")}
                            </button>
                        </p>
                        <Link href="/login" className="block text-sm text-primary hover:underline">
                            {t("auth.verifyResetCode.backToLogin")}
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function VerifyResetCodePage() {
    return (
        <Suspense fallback={null}>
            <VerifyResetCodeForm />
        </Suspense>
    );
}