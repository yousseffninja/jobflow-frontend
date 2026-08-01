"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Briefcase, ExternalLink, Clock } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import { getJob, getJobStatusHistory } from "@/lib/job-service";
import { getInterviewsByJob } from "@/lib/interview-service";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { AiToolsSection } from "@/components/jobs/AiToolsSection";

export default function JobDetailPage() {
    const { t, dir } = useLocale();
    const router = useRouter();
    const params = useParams();
    const jobId = params.id as string;
    const BackArrow = dir === "rtl" ? ArrowRight : ArrowLeft;

    const { data: job, isLoading } = useQuery({
        queryKey: ["job", jobId],
        queryFn: () => getJob(jobId),
    });

    const { data: history } = useQuery({
        queryKey: ["job-history", jobId],
        queryFn: () => getJobStatusHistory(jobId),
    });

    const { data: interviews } = useQuery({
        queryKey: ["job-interviews", jobId],
        queryFn: () => getInterviewsByJob(jobId),
    });

    if (isLoading || !job) {
        return <div className="h-40 rounded-lg bg-surface-container animate-pulse" />;
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <button
                onClick={() => router.push("/jobs")}
                className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface"
            >
                <BackArrow className="h-4 w-4" />
                {t("jobDetail.back")}
            </button>

            <div className="flex items-start gap-4 flex-wrap">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-surface-container-high overflow-hidden">
                    {job.companyLogoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={job.companyLogoUrl} alt={job.companyName} className="h-full w-full object-cover" />
                    ) : (
                        <Briefcase className="h-6 w-6 text-on-surface-variant" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h1 className="font-heading text-2xl font-semibold text-on-surface">{job.title}</h1>
                    <p className="text-sm text-on-surface-variant">{job.companyName}</p>
                </div>
                <StatusBadge status={job.currentStatus} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Overview + Description */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
                        <h2 className="text-sm font-semibold text-on-surface mb-3">{t("jobDetail.overview")}</h2>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-on-surface-variant text-xs mb-1">{t("jobDetail.salary")}</dt>
                                <dd className="text-on-surface">
                                    {job.salaryMin || job.salaryMax
                                        ? `${job.currency} ${job.salaryMin?.toLocaleString() ?? "?"} - ${job.salaryMax?.toLocaleString() ?? "?"}`
                                        : t("jobDetail.notSpecified")}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-on-surface-variant text-xs mb-1">{t("jobs.priority")}</dt>
                                <dd className="text-on-surface">{t(`jobs.priorityLevel.${job.priority}`)}</dd>
                            </div>
                            {job.sourceUrl && (
                                <div className="col-span-2">
                                    <dt className="text-on-surface-variant text-xs mb-1">{t("jobDetail.posting")}</dt>
                                    <dd>
                                        <a
                                        href={job.sourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-primary hover:underline"
                                        >
                                        {t("jobDetail.viewPosting")}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </dd>
                                </div>
                                )}
                        </dl>
                    </div>

                    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
                        <h2 className="text-sm font-semibold text-on-surface mb-3">{t("jobDetail.description")}</h2>
                        <p className="text-sm text-on-surface-variant whitespace-pre-wrap">
                            {job.description || t("jobDetail.noDescription")}
                        </p>
                    </div>

                    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5">
                        <h2 className="text-sm font-semibold text-on-surface mb-3">{t("jobDetail.interviews")}</h2>
                        {!interviews?.length ? (
                            <p className="text-sm text-on-surface-variant">{t("jobDetail.noInterviewsYet")}</p>
                        ) : (
                            <ul className="space-y-3">
                                {interviews.map((iv) => (
                                    <li key={iv.id} className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
                                            <Clock className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-on-surface">
                                                {t(`jobDetail.type.${iv.type}`)}
                                            </p>
                                            <p className="text-xs text-on-surface-variant">
                                                {new Date(iv.scheduledAt).toLocaleString()} · {t(`jobDetail.outcome.${iv.outcome}`)}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <AiToolsSection jobId={jobId} />
                </div>

                {/* Right: Timeline */}
                <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-5 h-fit">
                    <h2 className="text-sm font-semibold text-on-surface mb-4">{t("jobDetail.timeline")}</h2>
                    <ol className="relative border-s border-outline-variant ps-4 space-y-4">
                        {history?.map((entry, i) => (
                            <li key={i} className="relative">
                                <span className="absolute -start-[1.34rem] top-1 h-2.5 w-2.5 rounded-full bg-primary" />
                                <p className="text-sm text-on-surface font-medium">
                                    {entry.oldStatus
                                        ? `${t(`jobs.status.${entry.oldStatus}`)} → ${t(`jobs.status.${entry.newStatus}`)}`
                                        : t("jobDetail.created")}
                                </p>
                                {entry.note && <p className="text-xs text-on-surface-variant mt-0.5">{entry.note}</p>}
                                <p className="text-xs text-on-surface-variant mt-0.5">
                                    {new Date(entry.changedAt).toLocaleString()}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    );
}