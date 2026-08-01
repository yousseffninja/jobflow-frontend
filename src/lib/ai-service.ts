import { apiClient } from "./api-client";

export type AiGenerationResponse = {
    id: string;
    type: string;
    result: string;
    createdAt: string;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };

export async function reviewResume(jobId: string, file: File) {
    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("file", file);
    const { data } = await apiClient.post<ApiResponse<AiGenerationResponse>>(
        "/api/v1/ai/resume-review",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
}

export async function generateCoverLetter(jobId: string, tone?: string) {
    const { data } = await apiClient.post<ApiResponse<AiGenerationResponse>>(
        "/api/v1/ai/cover-letter",
        { jobId, tone }
    );
    return data.data;
}

export async function generateInterviewQuestions(jobId: string) {
    const { data } = await apiClient.post<ApiResponse<AiGenerationResponse>>(
        "/api/v1/ai/interview-questions",
        { jobId }
    );
    return data.data;
}