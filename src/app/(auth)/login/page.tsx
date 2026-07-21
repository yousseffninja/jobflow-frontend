"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";

export default function LoginPage() {
    const { t } = useLocale();
    const { theme, setTheme } = useTheme();
    const [showPassword, setShowPassword] = useState(false);

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

            {/* Form side */}
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

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.login.email")}
                            </label>
                            <div className="relative">
                                <Mail className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                                <input
                                    type="email"
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
                            className="w-full rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition"
                        >
                            {t("auth.login.signIn")}
                        </button>

                        <button
                            type="button"
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest text-on-surface font-medium py-2.5 text-sm hover:bg-surface-container transition"
                        >
                            {t("auth.login.orContinueWith")}
                        </button>
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