"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from "@/components/admin/Sidebar";
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);





    const fetchCurrentUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                // If not authenticated, redirect to login
                router.push('/admin/login');
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            router.push('/admin/login');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/admin/login');
            router.refresh();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    useEffect(() => {
        if (pathname !== '/admin/login') {
            fetchCurrentUser();
        }
    }, [pathname]);

    // If we are on the login page, render it without the admin layout and auth check
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black overflow-hidden">
            <AdminSidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 border-b border-white/10 bg-gradient-to-r from-black to-gray-900/50 backdrop-blur-sm">
                    <div className="h-full px-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
                            <p className="text-sm text-gray-400">Manage your content</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                                <p className="text-xs text-gray-400">{user?.email || 'admin@whfnepal.org'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleLogout}
                                className="text-gray-400 hover:text-white hover:bg-white/10"
                                title="Logout"
                            >
                                <LogOut className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

