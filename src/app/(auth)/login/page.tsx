"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Mail, Lock, Sparkles, AlertCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { useAuthStore } from "@/store/auth-store";
import { loginUser } from "@/lib/auth-service";
import { isAxiosError } from "axios";

export default function LoginPage() {
    const { t } = useLocale();
    const { theme, setTheme } = useTheme();
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

            <div className="relative flex w-full lg:w-1/2 flex-col justify-center px-6 sm:px-16 py-12 bg-surface-container-lowest">
                <button
                    type="button"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="absolute top-4 end-4 text-sm text-on-surface-variant border border-outline-variant rounded-md px-3 py-1.5"
                >
                    Toggle theme
                </button>

                <div className="mx-auto w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Sparkles className="h-4 w-4 text-on-primary" />
                        </div>
                        <span className="font-heading font-semibold text-lg text-on-surface">
              {t("common.appName")}
            </span>
                    </div>

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
                            <div className="relative">
                                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("auth.login.emailPlaceholder")}
                                    className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-sm font-medium text-on-surface">
                                    {t("auth.login.password")}
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    {t("auth.login.forgotPassword")}
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-10 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
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

                        <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                            <input type="checkbox" className="rounded border-outline-variant" />
                            {t("auth.login.rememberMe")}
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("auth.login.signIn")}
                        </button>

                        <a
                            href={`${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/google`}
                            className="flex items-center justify-center w-full rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface font-medium py-2.5 text-sm hover:bg-surface-container transition"
                        >
                            {t("auth.login.orContinueWith")}
                        </a>
                </form>

                <p className="text-center text-sm text-on-surface-variant mt-6">
                    {t("auth.login.noAccount")}{" "}
                    <Link href="/register" className="text-primary hover:underline font-medium">
                        {t("auth.login.register")}
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}