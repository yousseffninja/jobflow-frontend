import { apiClient } from "./api-client";
import { JobStatus } from "./job-service";

export type DashboardStats = {
    totalApplications: number;
    responseRate: number;
    interviewRate: number;
    offerRate: number;
};

export type StatusBreakdownItem = {
    status: JobStatus;
    count: number;
};

export type RecentActivityItem = {
    jobId: string;
    jobTitle: string;
    companyName: string;
    oldStatus: JobStatus | null;
    newStatus: JobStatus;
    note: string | null;
    changedAt: string;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };

export async function getDashboardStats() {
    const { data } = await apiClient.get<ApiResponse<DashboardStats>>("/api/v1/dashboard/stats");
    return data.data;
}

export async function getStatusBreakdown() {
    const { data } = await apiClient.get<ApiResponse<StatusBreakdownItem[]>>(
        "/api/v1/dashboard/status-breakdown"
    );
    return data.data;
}

export async function getRecentActivity(limit = 5) {
    const { data } = await apiClient.get<ApiResponse<RecentActivityItem[]>>(
        "/api/v1/dashboard/recent-activity",
        { params: { limit } }
    );
    return data.data;
}