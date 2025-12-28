"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
    _id: string;
    id: string; // alias for _id for compatibility
    name: string;
    email: string;
    role: string;
    image?: string;
    membershipStatus?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshAuth: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await fetch("/api/members/me");
            if (res.ok) {
                const data = await res.json();
                // Map _id to id for compatibility
                if (data._id) {
                    data.id = data._id;
                }
                setUser(data);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Failed to fetch auth state:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refreshAuth: fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
