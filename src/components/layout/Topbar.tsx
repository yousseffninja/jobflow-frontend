"use client";

import { Bell, Sun, Moon, Languages, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useLocale } from "@/providers/locale-provider";
import { useAuthStore } from "@/store/auth-store";

type TopbarProps = {
    onMenuClick: () => void;
};

export function Topbar({ onMenuClick }: TopbarProps) {
    const { theme, setTheme } = useTheme();
    const { locale, setLocale } = useLocale();
    const user = useAuthStore((state) => state.user);

    return (
        <header className="flex items-center justify-between h-(--spacing-header) px-4 sm:px-6 border-b border-outline-variant bg-surface-container-lowest">
            <button
                onClick={onMenuClick}
                className="lg:hidden flex items-center justify-center h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-container transition"
            >
                <Menu className="h-5 w-5" />
            </button>

            <div className="hidden lg:block" />

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setLocale(locale === "en" ? "ar" : "en")}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-container transition"
                    title="Switch language"
                >
                    <Languages className="h-4.5 w-4.5" />
                </button>

                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="flex items-center justify-center h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-container transition"
                    title="Toggle theme"
                >
                    {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
                </button>

                <button className="flex items-center justify-center h-9 w-9 rounded-md text-on-surface-variant hover:bg-surface-container transition relative">
                    <Bell className="h-4.5 w-4.5" />
                </button>

                <div className="flex items-center gap-2 ps-2 ms-1 border-s border-outline-variant">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-container text-on-primary-container text-sm font-medium">
                        {user?.fullName?.charAt(0).toUpperCase() || "?"}
                    </div>
                </div>
            </div>
        </header>
    );
}