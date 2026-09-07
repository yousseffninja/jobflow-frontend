"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Building2, Plus, Search, Globe, X } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { getCompanies, createCompany, Company } from "@/lib/company-service";

export default function CompaniesPage() {
    const { t } = useLocale();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ["companies", search],
        queryFn: () => getCompanies(search),
    });

    const createMutation = useMutation({
        mutationFn: createCompany,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companies"] });
            setShowModal(false);
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-on-surface">
                        {t("companies.title")}
                    </h1>
                    <p className="text-sm text-on-surface-variant">{t("companies.subtitle")}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition"
                >
                    <Plus className="h-4 w-4" />
                    {t("companies.addCompany")}
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("companies.searchPlaceholder")}
                    className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary transition"
                />
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-32 rounded-lg bg-surface-container animate-pulse" />
                    ))}
                </div>
            ) : !data?.content.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container mb-4">
                        <Building2 className="h-6 w-6 text-on-surface-variant" />
                    </div>
                    <p className="font-medium text-on-surface">{t("companies.noCompanies")}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{t("companies.noCompaniesDesc")}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.content.map((company: Company) => (
                        <div
                            key={company.id}
                            className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high overflow-hidden">
                                    {company.logoUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={company.logoUrl} alt={company.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <Building2 className="h-5 w-5 text-on-surface-variant" />
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-medium text-on-surface truncate">{company.name}</p>
                                    {company.website && (
                                        <a
                                            href={company.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-xs text-on-surface-variant hover:text-primary truncate"
                                        >
                                            <Globe className="h-3 w-3 shrink-0" />
                                            {company.website.replace(/^https?:\/\//, "")}
                                        </a>
                                    )}
                                </div>
                            </div>
                            {company.hrContactName && (
                            <p className="text-xs text-on-surface-variant">
                                {company.hrContactName}
                                {company.hrContactEmail && ` · ${company.hrContactEmail}`}
                            </p>
                            )}
                        </div>
                    ))}
                </div>
            )}

{showModal && (
    <CreateCompanyModal
        onClose={() => setShowModal(false)}
        onSubmit={(payload) => createMutation.mutate(payload)}
        isLoading={createMutation.isPending}
    />
)}
</div>
);
}

function CreateCompanyModal({
                                onClose,
                                onSubmit,
                                isLoading,
                            }: {
    onClose: () => void;
    onSubmit: (payload: {
        name: string;
        website?: string;
        hrContactName?: string;
        hrContactEmail?: string;
    }) => void;
    isLoading: boolean;
}) {
    const { t } = useLocale();
    const [name, setName] = useState("");
    const [website, setWebsite] = useState("");
    const [hrContactName, setHrContactName] = useState("");
    const [hrContactEmail, setHrContactEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, website, hrContactName, hrContactEmail });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-outline-variant p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-on-surface">
                        {t("companies.addCompany")}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("companies.name")}
                        </label>
                        <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("companies.website")}
                        </label>
                        <input
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="https://"
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("companies.hrContactName")}
                        </label>
                        <input
                            value={hrContactName}
                            onChange={(e) => setHrContactName(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("companies.hrContactEmail")}
                        </label>
                        <input
                            type="email"
                            value={hrContactEmail}
                            onChange={(e) => setHrContactEmail(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-outline-variant text-on-surface font-medium py-2 text-sm hover:bg-surface-container transition"
                        >
                            {t("companies.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-md bg-primary text-on-primary font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("companies.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}