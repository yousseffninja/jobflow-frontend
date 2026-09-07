"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Briefcase,
    Building2,
    CalendarDays,
    Bell,
    Settings,
    Sparkles,
    X,
} from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

const navItems = [
    { href: "/dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
    { href: "/jobs", labelKey: "nav.jobs", icon: Briefcase },
    { href: "/companies", labelKey: "nav.companies", icon: Building2 },
    { href: "/interviews", labelKey: "nav.interviews", icon: CalendarDays },
    { href: "/notifications", labelKey: "nav.notifications", icon: Bell },
    { href: "/settings", labelKey: "nav.settings", icon: Settings },
];

type SidebarProps = {
    mobileOpen: boolean;
    onClose: () => void;
};

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
    const { t } = useLocale();
    const pathname = usePathname();

    const navLinks = (
        <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
                            isActive
                                ? "bg-primary-container/15 text-primary border-s-2 border-primary ps-2.5"
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        }`}
                    >
                        <Icon className="h-4.5 w-4.5" />
                        {t(item.labelKey)}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <>
            {/* Desktop sidebar — always visible on lg+ */}
            <aside className="hidden lg:flex lg:w-(--spacing-sidebar) shrink-0 flex-col border-e border-outline-variant bg-surface-container-lowest">
                <div className="flex items-center gap-2 px-5 h-(--spacing-header) border-b border-outline-variant">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                        <Sparkles className="h-4 w-4 text-on-primary" />
                    </div>
                    <span className="font-heading font-semibold text-on-surface">
            {t("common.appName")}
          </span>
                </div>
                {navLinks}
            </aside>

            {/* Mobile backdrop */}
            <div
                onClick={onClose}
                className={`lg:hidden fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
                    mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Mobile drawer */}
            <aside
                className={`lg:hidden fixed inset-y-0 start-0 z-50 w-72 flex flex-col border-e border-outline-variant bg-surface-container-lowest transition-transform duration-300 ease-in-out ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between gap-2 px-5 h-(--spacing-header) border-b border-outline-variant">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                            <Sparkles className="h-4 w-4 text-on-primary" />
                        </div>
                        <span className="font-heading font-semibold text-on-surface">
              {t("common.appName")}
            </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>
                {navLinks}
            </aside>
        </>
    );
}