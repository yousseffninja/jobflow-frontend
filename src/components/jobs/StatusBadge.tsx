import { JobStatus } from "@/lib/job-service";
import { useLocale } from "@/providers/locale-provider";

const statusColors: Record<JobStatus, string> = {
    WISHLIST: "bg-secondary-container text-on-secondary-container",
    APPLIED: "bg-primary-container/20 text-primary",
    INTERVIEWING: "bg-tertiary-container/20 text-tertiary",
    OFFER: "bg-green-500/15 text-green-600 dark:text-green-400",
    REJECTED: "bg-error-container text-on-error-container",
    WITHDRAWN: "bg-surface-container-high text-on-surface-variant",
};

export function StatusBadge({ status }: { status: JobStatus }) {
    const { t } = useLocale();
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${statusColors[status]}`}
        >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {t(`jobs.status.${status}`)}
    </span>
    );
}