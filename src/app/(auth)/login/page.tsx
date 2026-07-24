"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { useAuthStore } from "@/store/auth-store";
import { loginUser } from "@/lib/auth-service";
import { isAxiosError } from "axios";

export default function LoginPage() {
    const { t } = useLocale();
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        setIsLoading(true);
        try {
            const result = await loginUser({ email, password });
            setAuth(result.user, result.accessToken);
            router.push("/dashboard");
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
        <div className="flex min-h-screen">
            <AuthHeroPanel
                badgeKey="auth.login.heroBadge"
                titleKey="auth.login.heroTitle"
                subtitleKey="auth.login.heroSubtitle"
                feature1TitleKey="auth.login.heroFeature1Title"
                feature1DescKey="auth.login.heroFeature1Desc"
                feature2TitleKey="auth.login.heroFeature2Title"
                feature2DescKey="auth.login.heroFeature2Desc"
            />

            <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 sm:px-16 py-12 bg-surface-container-lowest">
                <div className="mx-auto w-full max-w-sm">
                    <h2 className="font-heading text-2xl font-semibold text-on-surface mb-1">
                        {t("auth.login.title")}
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-6">
                        {t("auth.login.subtitle")}
                    </p>

                    {error && (
                        <div className="flex items-center gap-2 rounded-md bg-error-container text-on-error-container px-3 py-2.5 text-sm mb-4">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.login.email")}
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("auth.login.emailPlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.login.password")}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 pe-10 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute end-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                                <input
                                    type="checkbox"
                                    className="rounded border-outline-variant"
                                />
                                <span>{t("auth.login.rememberMe")}</span>
                            </label>
                            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                                {t("auth.login.forgotPassword")}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("auth.login.signIn")}
                        </button>
                    </form>

                    <p className="text-center text-sm text-on-surface-variant mt-6">
                        {t("auth.login.noAccount")}{" "}
                        <Link href="/register" className="text-primary hover:underline font-medium">
                            {t("auth.register.createAccount")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}