import { apiClient } from "./api-client";

export type Notification = {
    id: string;
    type: string;
    title: string;
    message: string;
    relatedEntityType: string | null;
    relatedEntityId: string | null;
    read: boolean;
    createdAt: string;
};

type ApiResponse<T> = { success: boolean; message?: string; data: T; timestamp: string };
type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number };

export async function getNotifications() {
    const { data } = await apiClient.get<ApiResponse<Page<Notification>>>("/api/v1/notifications", {
        params: { size: 20 },
    });
    return data.data;
}

export async function getUnreadCount() {
    const { data } = await apiClient.get<ApiResponse<number>>(
        "/api/v1/notifications/unread-count"
    );
    return data.data ?? 0;
}

export async function markAsRead(id: string) {
    await apiClient.patch(`/api/v1/notifications/${id}/read`);
}

export async function markAllAsRead() {
    await apiClient.patch("/api/v1/notifications/read-all");
}