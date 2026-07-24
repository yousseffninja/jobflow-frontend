import { apiClient } from "./api-client";

export type UserSummary = {
    id: string;
    email: string;
    fullName: string;
    emailVerified: boolean;
};

export type AuthResponse = {
    accessToken: string;
    user: UserSummary;
};

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
    timestamp: string;
};

export async function registerUser(payload: {
    email: string;
    password: string;
    fullName: string;
}) {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/v1/auth/register",
        payload
    );
    return data.data;
}

export async function confirmEmail(payload: { email: string; code: string }) {
    const { data } = await apiClient.post<ApiResponse<null>>(
        "/api/v1/auth/confirm",
        payload
    );
    return data;
}

export async function loginUser(payload: { email: string; password: string }) {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
        "/api/v1/auth/login",
        payload
    );
    return data.data;
}

export async function logoutUser() {
    const { data } = await apiClient.post<ApiResponse<null>>("/api/v1/auth/logout");
    return data;
}

export async function forgotPassword(payload: { email: string }) {
    const { data } = await apiClient.post<ApiResponse<null>>(
        "/api/v1/auth/forgot-password",
        payload
    );
    return data;
}

export async function verifyResetCode(payload: { email: string; code: string }) {
    const { data } = await apiClient.post<ApiResponse<null>>(
        "/api/v1/auth/verify-reset-code",
        payload
    );
    return data;
}

export async function resetPassword(payload: {
    email: string;
    code: string;
    newPassword: string;
}) {
    const { data } = await apiClient.post<ApiResponse<null>>(
        "/api/v1/auth/reset-password",
        payload
    );
    return data;
}