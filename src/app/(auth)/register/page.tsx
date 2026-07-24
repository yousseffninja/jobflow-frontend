"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { AuthHeroPanel } from "@/components/auth/AuthHeroPanel";
import { useAuthStore } from "@/store/auth-store";
import { registerUser } from "@/lib/auth-service";
import { isAxiosError } from "axios";

export default function RegisterPage() {
    const { t } = useLocale();
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);

    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const requirements = [
        { key: "reqLength", met: password.length >= 8 },
        { key: "reqUppercase", met: /[A-Z]/.test(password) },
        { key: "reqNumber", met: /\d/.test(password) },
        { key: "reqSpecial", met: /[^A-Za-z0-9]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (!agreed) {
            setError("You must agree to the Terms of Service");
            return;
        }

        setIsLoading(true);
        try {
            const result = await registerUser({ email, password, fullName });
            setAuth(result.user, result.accessToken);
            router.push("/verify-email");
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
                badgeKey="auth.register.heroBadge"
                titleKey="auth.register.heroTitle"
                subtitleKey="auth.register.heroSubtitle"
                feature1TitleKey="auth.register.heroFeature1Title"
                feature1DescKey="auth.register.heroFeature1Desc"
                feature2TitleKey="auth.register.heroFeature2Title"
                feature2DescKey="auth.register.heroFeature2Desc"
            />

            <div className="flex w-full lg:w-1/2 flex-col justify-center px-6 sm:px-16 py-12 bg-surface-container-lowest">
                <div className="mx-auto w-full max-w-sm">
                    <h2 className="font-heading text-2xl font-semibold text-on-surface mb-1">
                        {t("auth.register.title")}
                    </h2>
                    <p className="text-sm text-on-surface-variant mb-6">
                        {t("auth.register.subtitle")}
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
                                {t("auth.register.fullName")}
                            </label>
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder={t("auth.register.fullNamePlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.register.email")}
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t("auth.register.emailPlaceholder")}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.register.password")}
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

                            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                                {requirements.map((req) => (
                                    <div
                                        key={req.key}
                                        className={`flex items-center gap-1.5 text-xs ${
                                            req.met ? "text-primary" : "text-on-surface-variant"
                                        }`}
                                    >
                    <span
                        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
                            req.met ? "bg-primary border-primary" : "border-outline-variant"
                        }`}
                    >
                      {req.met && <Check className="h-2.5 w-2.5 text-on-primary" />}
                    </span>
                                        {t(`auth.register.${req.key}`)}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">
                                {t("auth.register.confirmPassword")}
                            </label>
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary-container/20 transition"
                            />
                        </div>

                        <label className="flex items-start gap-2 text-sm text-on-surface-variant">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-0.5 rounded border-outline-variant"
                            />
                            <span>{t("auth.register.terms")}</span>
                        </label>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-primary text-on-primary font-medium py-2.5 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("auth.register.createAccount")}
                        </button>
                    </form>

                    <p className="text-center text-sm text-on-surface-variant mt-6">
                        {t("auth.register.haveAccount")}{" "}
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            {t("auth.register.logIn")}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}