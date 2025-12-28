"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, Video, Users, Images, TrendingUp } from "lucide-react";

interface Stats {
    posts: number;
    events: number;
    videos: number;
    representatives: number;
    galleries: number;
    users: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        posts: 0,
        events: 0,
        videos: 0,
        representatives: 0,
        galleries: 0,
        users: 0,
    });

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchStats(), fetchUser()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };

    const statCards = [
        { name: "Active Members", value: stats.users, icon: Users, color: "from-blue-500 to-cyan-500" },
        { name: "Total Posts", value: stats.posts, icon: FileText, color: "from-blue-600 to-indigo-600" },
        { name: "Total Events", value: stats.events, icon: Calendar, color: "from-green-500 to-emerald-600" },
        { name: "Total Videos", value: stats.videos, icon: Video, color: "from-purple-500 to-violet-600" },
        { name: "Representatives", value: stats.representatives, icon: Users, color: "from-orange-500 to-red-500" },
        { name: "Gallery Albums", value: stats.galleries, icon: Images, color: "from-pink-500 to-rose-600" },
    ];

    // Calculate max value for chart scaling
    const maxValue = Math.max(stats.posts, stats.events, stats.videos, stats.galleries, 1);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                <p className="text-gray-400 mt-2">
                    Welcome back, <span className="text-white font-semibold">{user?.name || 'Admin'}</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                {statCards.map((stat) => (
                    <div
                        key={stat.name}
                        className="p-6 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all group relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <stat.icon className="w-16 h-16" />
                        </div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-1">
                                {loading ? (
                                    <span className="animate-pulse inline-block w-8 h-8 bg-white/20 rounded"></span>
                                ) : (
                                    stat.value
                                )}
                            </h3>
                            <p className="text-sm text-gray-400 font-medium">{stat.name}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Content Distribution Chart */}
                <div className="lg:col-span-2 p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-6">Content Distribution</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Posts', value: stats.posts, color: 'bg-indigo-500' },
                            { label: 'Events', value: stats.events, color: 'bg-emerald-500' },
                            { label: 'Videos', value: stats.videos, color: 'bg-purple-500' },
                            { label: 'Albums', value: stats.galleries, color: 'bg-rose-500' },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-300">{item.label}</span>
                                    <span className="text-gray-400">{item.value}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-700/50 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                        style={{ width: `${loading ? 0 : (item.value / maxValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <a
                            href="/admin/posts"
                            className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all group border border-transparent hover:border-white/10"
                        >
                            <div className="p-2 bg-blue-500/20 rounded-md text-blue-400 mr-3 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <FileText className="w-4 h-4" />
                            </div>
                            <span>Create New Post</span>
                        </a>
                        <a
                            href="/admin/events"
                            className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all group border border-transparent hover:border-white/10"
                        >
                            <div className="p-2 bg-green-500/20 rounded-md text-green-400 mr-3 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span>Create New Event</span>
                        </a>
                        <a
                            href="/admin/videos"
                            className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all group border border-transparent hover:border-white/10"
                        >
                            <div className="p-2 bg-purple-500/20 rounded-md text-purple-400 mr-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                <Video className="w-4 h-4" />
                            </div>
                            <span>Add New Video</span>
                        </a>
                        <a
                            href="/admin/members"
                            className="flex items-center p-3 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 hover:text-white transition-all group border border-transparent hover:border-white/10"
                        >
                            <div className="p-2 bg-orange-500/20 rounded-md text-orange-400 mr-3 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <Users className="w-4 h-4" />
                            </div>
                            <span>Manage Members</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
