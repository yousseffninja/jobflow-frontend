import { apiClient } from "./api-client";

export type Company = {
    id: string;
    name: string;
    logoUrl: string | null;
    website: string | null;
    hrContactName: string | null;
    hrContactEmail: string | null;
    createdAt: string;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

export async function getCompanies(search?: string) {
    const { data } = await apiClient.get<ApiResponse<Page<Company>>>("/api/v1/companies", {
        params: { search, size: 50 },
    });
    return data.data;
}

export async function getCompany(id: string) {
    const { data } = await apiClient.get<ApiResponse<Company>>(`/api/v1/companies/${id}`);
    return data.data;
}

export async function createCompany(payload: {
    name: string;
    website?: string;
    hrContactName?: string;
    hrContactEmail?: string;
}) {
    const { data } = await apiClient.post<ApiResponse<Company>>("/api/v1/companies", payload);
    return data.data;
}

export async function uploadCompanyLogo(id: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await apiClient.post<ApiResponse<Company>>(
        `/api/v1/companies/${id}/logo`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
    );
    return data.data;
}

export async function deleteCompany(id: string) {
    await apiClient.delete(`/api/v1/companies/${id}`);
}