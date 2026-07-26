import { apiClient } from "./api-client";

export type JobStatus = "WISHLIST" | "APPLIED" | "INTERVIEWING" | "OFFER" | "REJECTED" | "WITHDRAWN";
export type Priority = "LOW" | "MEDIUM" | "HIGH";

export type Job = {
    id: string;
    companyId: string;
    companyName: string;
    companyLogoUrl: string | null;
    title: string;
    description: string | null;
    sourceUrl: string | null;
    salaryMin: number | null;
    salaryMax: number | null;
    currency: string;
    currentStatus: JobStatus;
    priority: Priority;
    appliedAt: string | null;
    createdAt: string;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

export async function getJobs(params: {
    status?: JobStatus;
    priority?: Priority;
    companyId?: string;
    search?: string;
}) {
    const { data } = await apiClient.get<ApiResponse<Page<Job>>>("/api/v1/jobs", {
        params: { ...params, size: 50, sort: "createdAt,desc" },
    });
    return data.data;
}

export async function createJob(payload: {
    companyId: string;
    title: string;
    description?: string;
    sourceUrl?: string;
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    priority: Priority;
}) {
    const { data } = await apiClient.post<ApiResponse<Job>>("/api/v1/jobs", payload);
    return data.data;
}

export async function updateJobStatus(id: string, status: JobStatus, note?: string) {
    const { data } = await apiClient.patch<ApiResponse<Job>>(`/api/v1/jobs/${id}/status`, {
        status,
        note,
    });
    return data.data;
}

export async function deleteJob(id: string) {
    await apiClient.delete(`/api/v1/jobs/${id}`);
}