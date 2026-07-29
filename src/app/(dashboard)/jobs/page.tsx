"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Plus, Search, X } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { getJobs, createJob, updateJobStatus, Job, JobStatus, Priority } from "@/lib/job-service";
import { getCompanies } from "@/lib/company-service";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useRouter } from "next/navigation";

const STATUSES: JobStatus[] = ["WISHLIST", "APPLIED", "INTERVIEWING", "OFFER", "REJECTED", "WITHDRAWN"];
const PRIORITIES: Priority[] = ["LOW", "MEDIUM", "HIGH"];

export default function JobsPage() {
    const { t } = useLocale();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<JobStatus | "">("");
    const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();

    const { data, isLoading } = useQuery({
        queryKey: ["jobs", search, statusFilter, priorityFilter],
        queryFn: () =>
            getJobs({
                search: search || undefined,
                status: statusFilter || undefined,
                priority: priorityFilter || undefined,
            }),
    });

    const { data: companiesData } = useQuery({
        queryKey: ["companies", ""],
        queryFn: () => getCompanies(),
    });

    const createMutation = useMutation({
        mutationFn: createJob,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["jobs"] });
            setShowModal(false);
        },
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: JobStatus }) => updateJobStatus(id, status),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["jobs"] }),
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-on-surface">{t("jobs.title")}</h1>
                    <p className="text-sm text-on-surface-variant">{t("jobs.subtitle")}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition"
                >
                    <Plus className="h-4 w-4" />
                    {t("jobs.addJob")}
                </button>
            </div>

            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={t("jobs.searchPlaceholder")}
                        className="w-full rounded-md border border-outline-variant bg-surface-container-lowest ps-10 pe-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as JobStatus | "")}
                    className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                >
                    <option value="">{t("jobs.allStatuses")}</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>{t(`jobs.status.${s}`)}</option>
                    ))}
                </select>
                <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
                    className="rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                >
                    <option value="">{t("jobs.allPriorities")}</option>
                    {PRIORITIES.map((p) => (
                        <option key={p} value={p}>{t(`jobs.priorityLevel.${p}`)}</option>
                    ))}
                </select>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-lg bg-surface-container animate-pulse" />
                    ))}
                </div>
            ) : !data?.content.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container mb-4">
                        <Briefcase className="h-6 w-6 text-on-surface-variant" />
                    </div>
                    <p className="font-medium text-on-surface">{t("jobs.noJobs")}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{t("jobs.noJobsDesc")}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.content.map((job: Job) => (
                        <div
                            key={job.id}
                            onClick={() => router.push(`/jobs/${job.id}`)}
                            className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 cursor-pointer hover:border-primary transition"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-surface-container-high overflow-hidden">
                                {job.companyLogoUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={job.companyLogoUrl} alt={job.companyName} className="h-full w-full object-cover" />
                                ) : (
                                    <Briefcase className="h-5 w-5 text-on-surface-variant" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-on-surface truncate">{job.title}</p>
                                <p className="text-xs text-on-surface-variant truncate">{job.companyName}</p>
                            </div>

                            {(job.salaryMin || job.salaryMax) && (
                                <div className="hidden sm:block text-xs text-on-surface-variant whitespace-nowrap">
                                    {job.currency} {job.salaryMin?.toLocaleString()}
                                    {job.salaryMax ? ` - ${job.salaryMax.toLocaleString()}` : ""}
                                </div>
                            )}

                            <select
                                value={job.currentStatus}
                                onChange={(e) =>
                                    statusMutation.mutate({ id: job.id, status: e.target.value as JobStatus })
                                }
                                className="rounded-md border border-outline-variant bg-surface-container-lowest px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary transition"
                            >
                                {STATUSES.map((s) => (
                                    <option key={s} value={s}>{t(`jobs.status.${s}`)}</option>
                                ))}
                            </select>

                            <StatusBadge status={job.currentStatus} />
                        </div>
                    ))}
                </div>
            )}

            {showModal && companiesData && (
                <CreateJobModal
                    companies={companiesData.content}
                    onClose={() => setShowModal(false)}
                    onSubmit={(payload) => createMutation.mutate(payload)}
                    isLoading={createMutation.isPending}
                />
            )}
        </div>
    );
}

function CreateJobModal({
                            companies,
                            onClose,
                            onSubmit,
                            isLoading,
                        }: {
    companies: { id: string; name: string }[];
    onClose: () => void;
    onSubmit: (payload: {
        companyId: string;
        title: string;
        sourceUrl?: string;
        salaryMin?: number;
        salaryMax?: number;
        priority: Priority;
    }) => void;
    isLoading: boolean;
}) {
    const { t } = useLocale();
    const [companyId, setCompanyId] = useState(companies[0]?.id || "");
    const [title, setTitle] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [priority, setPriority] = useState<Priority>("MEDIUM");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            companyId,
            title,
            sourceUrl: sourceUrl || undefined,
            salaryMin: salaryMin ? Number(salaryMin) : undefined,
            salaryMax: salaryMax ? Number(salaryMax) : undefined,
            priority,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-outline-variant p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-on-surface">{t("jobs.addJob")}</h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.company")}</label>
                        <select
                            required
                            value={companyId}
                            onChange={(e) => setCompanyId(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        >
                            {companies.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.jobTitle")}</label>
                        <input
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.salaryMin")}</label>
                            <input
                                type="number"
                                value={salaryMin}
                                onChange={(e) => setSalaryMin(e.target.value)}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.salaryMax")}</label>
                            <input
                                type="number"
                                value={salaryMax}
                                onChange={(e) => setSalaryMax(e.target.value)}
                                className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.priority")}</label>
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value as Priority)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        >
                            {PRIORITIES.map((p) => (
                                <option key={p} value={p}>{t(`jobs.priorityLevel.${p}`)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">{t("jobs.sourceUrl")}</label>
                        <input
                            value={sourceUrl}
                            onChange={(e) => setSourceUrl(e.target.value)}
                            placeholder="https://"
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-outline-variant text-on-surface font-medium py-2 text-sm hover:bg-surface-container transition"
                        >
                            {t("jobs.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-md bg-primary text-on-primary font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("jobs.create")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}