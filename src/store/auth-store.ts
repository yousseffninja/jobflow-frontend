import { create } from "zustand";

type User = {
    id: string;
    email: string;
    fullName: string;
    emailVerified: boolean;
};

type AuthState = {
    user: User | null;
    accessToken: string | null;
    setAuth: (user: User, accessToken: string) => void;
    setAccessToken: (token: string) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    setAuth: (user, accessToken) => set({ user, accessToken }),
    setAccessToken: (accessToken) => set({ accessToken }),
    logout: () => set({ user: null, accessToken: null }),
}));