"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Plus, Clock, X } from "lucide-react";
import { useLocale } from "@/providers/locale-provider";
import {
    getInterviews,
    createInterview,
    submitInterviewFeedback,
    Interview,
    InterviewType,
    InterviewOutcome,
} from "@/lib/interview-service";
import { getJobs } from "@/lib/job-service";

const TYPES: InterviewType[] = ["PHONE_SCREEN", "TECHNICAL", "ONSITE", "HR", "FINAL"];
const OUTCOMES: InterviewOutcome[] = ["PENDING", "PASSED", "FAILED"];

const outcomeColors: Record<InterviewOutcome, string> = {
    PENDING: "bg-secondary-container text-on-secondary-container",
    PASSED: "bg-green-500/15 text-green-600 dark:text-green-400",
    FAILED: "bg-error-container text-on-error-container",
};

export default function InterviewsPage() {
    const { t } = useLocale();
    const queryClient = useQueryClient();
    const [showModal, setShowModal] = useState(false);
    const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["interviews"],
        queryFn: getInterviews,
    });

    const { data: jobsData } = useQuery({
        queryKey: ["jobs", "", "", "", ""],
        queryFn: () => getJobs({}),
    });

    const createMutation = useMutation({
        mutationFn: createInterview,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            setShowModal(false);
        },
    });

    const feedbackMutation = useMutation({
        mutationFn: ({ id, feedback, outcome }: { id: string; feedback: string; outcome: InterviewOutcome }) =>
            submitInterviewFeedback(id, { feedback, outcome }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["interviews"] });
            setSelectedInterview(null);
        },
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="font-heading text-2xl font-semibold text-on-surface">
                        {t("interviewsPage.title")}
                    </h1>
                    <p className="text-sm text-on-surface-variant">{t("interviewsPage.subtitle")}</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 rounded-md bg-primary text-on-primary font-medium px-4 py-2 text-sm hover:opacity-90 transition"
                >
                    <Plus className="h-4 w-4" />
                    {t("interviewsPage.schedule")}
                </button>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-20 rounded-lg bg-surface-container animate-pulse" />
                    ))}
                </div>
            ) : !data?.content.length ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container mb-4">
                        <CalendarDays className="h-6 w-6 text-on-surface-variant" />
                    </div>
                    <p className="font-medium text-on-surface">{t("interviewsPage.noInterviews")}</p>
                    <p className="text-sm text-on-surface-variant mt-1">{t("interviewsPage.noInterviewsDesc")}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {data.content.map((iv) => (
                        <div
                            key={iv.id}
                            onClick={() => setSelectedInterview(iv)}
                            className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-4 cursor-pointer hover:border-primary transition"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-secondary-container text-on-secondary-container">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-medium text-on-surface truncate">{iv.jobTitle}</p>
                                <p className="text-xs text-on-surface-variant truncate">
                                    {iv.companyName} · {t(`jobDetail.type.${iv.type}`)}
                                </p>
                            </div>
                            <p className="hidden sm:block text-xs text-on-surface-variant whitespace-nowrap">
                                {new Date(iv.scheduledAt).toLocaleString()}
                            </p>
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${outcomeColors[iv.outcome]}`}
                            >
                {t(`jobDetail.outcome.${iv.outcome}`)}
              </span>
                        </div>
                    ))}
                </div>
            )}

            {showModal && jobsData && (
                <ScheduleInterviewModal
                    jobs={jobsData.content}
                    onClose={() => setShowModal(false)}
                    onSubmit={(payload) => createMutation.mutate(payload)}
                    isLoading={createMutation.isPending}
                />
            )}

            {selectedInterview && (
                <FeedbackModal
                    interview={selectedInterview}
                    onClose={() => setSelectedInterview(null)}
                    onSubmit={(feedback, outcome) =>
                        feedbackMutation.mutate({ id: selectedInterview.id, feedback, outcome })
                    }
                    isLoading={feedbackMutation.isPending}
                />
            )}
        </div>
    );
}

function ScheduleInterviewModal({
                                    jobs,
                                    onClose,
                                    onSubmit,
                                    isLoading,
                                }: {
    jobs: { id: string; title: string }[];
    onClose: () => void;
    onSubmit: (payload: {
        jobId: string;
        type: InterviewType;
        scheduledAt: string;
        durationMinutes?: number;
        location?: string;
        interviewerName?: string;
    }) => void;
    isLoading: boolean;
}) {
    const { t } = useLocale();
    const [jobId, setJobId] = useState(jobs[0]?.id || "");
    const [type, setType] = useState<InterviewType>("PHONE_SCREEN");
    const [scheduledAt, setScheduledAt] = useState("");
    const [duration, setDuration] = useState("60");
    const [location, setLocation] = useState("");
    const [interviewerName, setInterviewerName] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            jobId,
            type,
            scheduledAt,
            durationMinutes: duration ? Number(duration) : undefined,
            location: location || undefined,
            interviewerName: interviewerName || undefined,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-outline-variant p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-lg font-semibold text-on-surface">
                        {t("interviewsPage.schedule")}
                    </h2>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.job")}
                        </label>
                        <select
                            required
                            value={jobId}
                            onChange={(e) => setJobId(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        >
                            {jobs.map((j) => (
                                <option key={j.id} value={j.id}>{j.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.type")}
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as InterviewType)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        >
                            {TYPES.map((tp) => (
                                <option key={tp} value={tp}>{t(`jobDetail.type.${tp}`)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.dateTime")}
                        </label>
                        <input
                            required
                            type="datetime-local"
                            value={scheduledAt}
                            onChange={(e) => setScheduledAt(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.duration")}
                        </label>
                        <input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.location")}
                        </label>
                        <input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.interviewer")}
                        </label>
                        <input
                            value={interviewerName}
                            onChange={(e) => setInterviewerName(e.target.value)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        />
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-md border border-outline-variant text-on-surface font-medium py-2 text-sm hover:bg-surface-container transition"
                        >
                            {t("interviewsPage.cancel")}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 rounded-md bg-primary text-on-primary font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-60"
                        >
                            {isLoading ? "..." : t("interviewsPage.schedule")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FeedbackModal({
                           interview,
                           onClose,
                           onSubmit,
                           isLoading,
                       }: {
    interview: Interview;
    onClose: () => void;
    onSubmit: (feedback: string, outcome: InterviewOutcome) => void;
    isLoading: boolean;
}) {
    const { t } = useLocale();
    const [feedback, setFeedback] = useState(interview.feedback || "");
    const [outcome, setOutcome] = useState<InterviewOutcome>(interview.outcome);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(feedback, outcome);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-lg bg-surface-container-lowest border border-outline-variant p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="font-heading text-lg font-semibold text-on-surface">{interview.jobTitle}</h2>
                        <p className="text-xs text-on-surface-variant">{interview.companyName}</p>
                    </div>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">Outcome</label>
                        <select
                            value={outcome}
                            onChange={(e) => setOutcome(e.target.value as InterviewOutcome)}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition"
                        >
                            {OUTCOMES.map((o) => (
                                <option key={o} value={o}>{t(`jobDetail.outcome.${o}`)}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-on-surface mb-1.5">
                            {t("interviewsPage.feedback")}
                        </label>
                        <textarea
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder={t("interviewsPage.feedbackPlaceholder")}
                            className="w-full rounded-md border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary transition resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-md bg-primary text-on-primary font-medium py-2 text-sm hover:opacity-90 transition disabled:opacity-60"
                    >
                        {isLoading ? "..." : t("interviewsPage.submitFeedback")}
                    </button>
                </form>
            </div>
        </div>
    );
}