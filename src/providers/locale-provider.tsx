"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";

type Locale = "en" | "ar";

const messages = { en, ar };

type LocaleContextType = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    t: (path: string) => string;
    dir: "ltr" | "rtl";
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

function getNestedValue(obj: Record<string, unknown>, path: string): string {
    const result = path
        .split(".")
        .reduce<unknown>((acc, key) => {
            if (acc && typeof acc === "object") {
                return (acc as Record<string, unknown>)[key];
            }
            return undefined;
        }, obj);
    return typeof result === "string" ? result : path;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window === "undefined") return "en";
        const stored = localStorage.getItem("locale") as Locale | null;
        return stored === "en" || stored === "ar" ? stored : "en";
    });

    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }, [locale]);

    const setLocale = useCallback((newLocale: Locale) => {
        localStorage.setItem("locale", newLocale);
        setLocaleState(newLocale);
    }, []);

    const t = useCallback(
        (path: string) => getNestedValue(messages[locale], path),
        [locale]
    );

    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t, dir }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error("useLocale must be used within a LocaleProvider");
    }
    return context;
}