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
    recentMembers: any[];
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        posts: 0,
        events: 0,
        videos: 0,
        representatives: 0,
        galleries: 0,
        users: 0,
        recentMembers: []
    });

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ name: string } | null>(null);

    // Calculator State
    const [calcItems, setCalcItems] = useState<{ id: number; label: string; amount: number }[]>([]);
    const [calcLabel, setCalcLabel] = useState("");
    const [calcAmount, setCalcAmount] = useState("");

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

    const handleAddCalcItem = () => {
        if (!calcAmount) return;
        const amount = parseFloat(calcAmount);
        if (isNaN(amount)) return;
        setCalcItems([...calcItems, { id: Date.now(), label: calcLabel || 'Donation', amount }]);
        setCalcLabel("");
        setCalcAmount("");
    };

    const removeCalcItem = (id: number) => {
        setCalcItems(calcItems.filter(item => item.id !== id));
    };

    const calcTotal = calcItems.reduce((sum, item) => sum + item.amount, 0);

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

            {/* Analytics & Actions */}
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

            {/* Bottom Section: Recent Registrations & Calculator */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Registrations Table */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Member Registrations</h3>
                        <a href="/admin/members" className="text-sm text-orange-400 hover:text-orange-300">View All</a>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 text-gray-400 text-sm">
                                    <th className="pb-3 font-medium">Name</th>
                                    <th className="pb-3 font-medium">Member ID</th>
                                    <th className="pb-3 font-medium">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {loading ? (
                                    <tr>
                                        <td colSpan={3} className="py-4 text-center text-gray-500">Loading...</td>
                                    </tr>
                                ) : stats.recentMembers && stats.recentMembers.length > 0 ? (
                                    stats.recentMembers.map((member: any) => (
                                        <tr key={member._id} className="group hover:bg-white/5 transition-colors">
                                            <td className="py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-bold text-xs uppercase">
                                                        {member.image ? (
                                                            <img src={member.image} alt={member.name} className="w-full h-full rounded-full object-cover" />
                                                        ) : (
                                                            member.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-200">{member.name}</div>
                                                        <div className="text-xs text-gray-500">{member.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 text-sm text-gray-400">
                                                {member.memberId || <span className="text-gray-600 italic">Pending</span>}
                                            </td>
                                            <td className="py-3 text-sm text-gray-400">
                                                {new Date(member.membershipDate || member.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-6 text-center text-gray-500">No recent registrations</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Donation Calculator */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                    <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                        <div className="p-1.5 bg-green-500/20 rounded text-green-400">
                            <span className="text-lg font-bold">₹</span>
                        </div>
                        Donation Calculator
                    </h3>

                    <div className="flex-1 flex flex-col gap-4">
                        {/* Summary Display */}
                        <div className="bg-black/30 p-4 rounded-lg border border-white/10 flex justify-between items-center mb-2">
                            <span className="text-gray-400">Total Calculated:</span>
                            <span className="text-2xl font-bold text-green-400">NPR {calcTotal.toLocaleString()}</span>
                        </div>

                        {/* Input Area */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Description (e.g. Donation)"
                                className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                                value={calcLabel}
                                onChange={(e) => setCalcLabel(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Amount"
                                className="w-24 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500"
                                value={calcAmount}
                                onChange={(e) => setCalcAmount(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddCalcItem()}
                            />
                            <button
                                onClick={handleAddCalcItem}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Add
                            </button>
                        </div>

                        {/* Items List */}
                        <div className="flex-1 overflow-y-auto max-h-[200px] border border-white/5 rounded-md bg-white/5 p-2">
                            {calcItems.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-gray-500 text-sm italic">
                                    Add items to calculate total
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {calcItems.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center p-2 bg-black/20 rounded hover:bg-black/40 text-sm group">
                                            <div className="flex items-center gap-2 truncate">
                                                <span className="text-gray-300">{item.label}</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="font-mono text-green-300">{item.amount.toLocaleString()}</span>
                                                <button
                                                    onClick={() => removeCalcItem(item.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Clear Button */}
                        {calcItems.length > 0 && (
                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={() => setCalcItems([])}
                                    className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

