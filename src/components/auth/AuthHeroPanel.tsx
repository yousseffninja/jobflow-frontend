"use client";

import { Sparkles, Rocket } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";

type AuthHeroPanelProps = {
    badgeKey: string;
    titleKey: string;
    subtitleKey: string;
    feature1TitleKey: string;
    feature1DescKey: string;
    feature2TitleKey: string;
    feature2DescKey: string;
};

export function AuthHeroPanel({
                                  badgeKey,
                                  titleKey,
                                  subtitleKey,
                                  feature1TitleKey,
                                  feature1DescKey,
                                  feature2TitleKey,
                                  feature2DescKey,
                              }: AuthHeroPanelProps) {
    const { t } = useLocale();

    return (
        <div
            className="hidden lg:flex lg:w-1/2 flex-col p-10 text-white relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(to bottom right, var(--color-brand-start), var(--color-brand-end))",
            }}
        >
            <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                    <Sparkles className="h-4 w-4" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="space-y-6 max-w-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/20 px-3 py-1 text-xs font-medium">
            <Sparkles className="h-3 w-3" />
              {t(badgeKey)}
          </span>

                    <h1 className="text-3xl font-semibold leading-tight">{t(titleKey)}</h1>
                    <p className="text-white/80">{t(subtitleKey)}</p>

                    <div className="grid grid-cols-2 gap-3 text-start">
                        <div className="rounded-lg bg-white/10 border border-white/15 p-4">
                            <Rocket className="h-4 w-4 mb-2" />
                            <p className="text-sm font-semibold mb-1">{t(feature1TitleKey)}</p>
                            <p className="text-xs text-white/70">{t(feature1DescKey)}</p>
                        </div>
                        <div className="rounded-lg bg-white/10 border border-white/15 p-4">
                            <Sparkles className="h-4 w-4 mb-2" />
                            <p className="text-sm font-semibold mb-1">{t(feature2TitleKey)}</p>
                            <p className="text-xs text-white/70">{t(feature2DescKey)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-xs text-white/50 text-center">{t("common.copyright")}</p>
        </div>
    );
}