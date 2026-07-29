import { apiClient } from "./api-client";

export type InterviewType = "PHONE_SCREEN" | "TECHNICAL" | "ONSITE" | "HR" | "FINAL";
export type InterviewOutcome = "PENDING" | "PASSED" | "FAILED";

export type Interview = {
    id: string;
    jobId: string;
    jobTitle: string;
    companyName: string;
    companyLogoUrl: string | null;
    type: InterviewType;
    scheduledAt: string;
    durationMinutes: number | null;
    location: string | null;
    interviewerName: string | null;
    feedback: string | null;
    outcome: InterviewOutcome;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

export async function getInterviews() {
    const { data } = await apiClient.get<ApiResponse<Page<Interview>>>("/api/v1/interviews", {
        params: { size: 50 },
    });
    return data.data;
}

export async function getUpcomingInterviews(days = 14) {
    const { data } = await apiClient.get<ApiResponse<Interview[]>>("/api/v1/interviews/upcoming", {
        params: { days },
    });
    return data.data;
}

export async function getInterviewsByJob(jobId: string) {
    const { data } = await apiClient.get<ApiResponse<Interview[]>>(`/api/v1/interviews/by-job/${jobId}`);
    return data.data;
}

export async function createInterview(payload: {
    jobId: string;
    type: InterviewType;
    scheduledAt: string;
    durationMinutes?: number;
    location?: string;
    interviewerName?: string;
}) {
    const { data } = await apiClient.post<ApiResponse<Interview>>("/api/v1/interviews", payload);
    return data.data;
}

export async function submitInterviewFeedback(
    id: string,
    payload: { feedback?: string; outcome: InterviewOutcome }
) {
    const { data } = await apiClient.patch<ApiResponse<Interview>>(
        `/api/v1/interviews/${id}/feedback`,
        payload
    );
    return data.data;
}

export async function deleteInterview(id: string) {
    await apiClient.delete(`/api/v1/interviews/${id}`);
}