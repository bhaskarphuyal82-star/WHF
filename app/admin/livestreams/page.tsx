"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Radio, MapPin, Eye, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LiveStream {
    _id: string;
    title: string;
    location: string;
    status: 'Live' | 'Scheduled' | 'Ended';
    views: number;
    isActive: boolean;
    thumbnail?: string;
    streamUrl: string;
    scheduledAt?: string;
    createdAt: string;
}

export default function LiveStreamsPage() {
    const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchLiveStreams();
    }, []);

    const fetchLiveStreams = async () => {
        try {
            const response = await fetch('/api/livestreams');
            const data = await response.json();
            setLiveStreams(data || []);
        } catch (error) {
            console.error('Failed to fetch live streams:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this live stream?')) return;

        try {
            const response = await fetch(`/api/livestreams/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setLiveStreams(liveStreams.filter(s => s._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete live stream:', error);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Live':
                return (
                    <span className="px-2 py-1 text-xs font-bold bg-red-500/20 text-red-400 rounded flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        LIVE
                    </span>
                );
            case 'Scheduled':
                return (
                    <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded">
                        Scheduled
                    </span>
                );
            case 'Ended':
                return (
                    <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded">
                        Ended
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Live Streams</h1>
                    <p className="text-gray-400 mt-1">Stream from religious places</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/livestreams/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Live Stream
                </Button>
            </div>

            {/* Live Streams Grid */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading live streams...
                    </div>
                ) : liveStreams.length === 0 ? (
                    <div className="p-12 text-center">
                        <Radio className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No live streams yet</p>
                        <Button
                            onClick={() => router.push('/admin/livestreams/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Live Stream
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Thumbnail</th>
                                    <th className="px-6 py-4">Stream Details</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Views</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {liveStreams.map((stream) => (
                                    <tr key={stream._id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-24 h-16 bg-white/10 rounded overflow-hidden relative">
                                                {stream.thumbnail ? (
                                                    <img
                                                        src={stream.thumbnail}
                                                        alt={stream.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-500">
                                                        <Radio className="w-6 h-6" />
                                                    </div>
                                                )}
                                                {stream.status === 'Live' && (
                                                    <div className="absolute top-1 left-1">
                                                        <span className="flex h-2 w-2">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="font-medium text-white line-clamp-1">{stream.title}</div>
                                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                                    <MapPin className="w-3 h-3" />
                                                    {stream.location}
                                                </div>
                                                {stream.scheduledAt && stream.status === 'Scheduled' && (
                                                    <div className="flex items-center gap-2 text-xs text-orange-400">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(stream.scheduledAt)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2 items-start">
                                                {getStatusBadge(stream.status)}
                                                <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full border ${stream.isActive
                                                        ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                                        : 'border-gray-500/30 text-gray-400 bg-gray-500/10'
                                                    }`}>
                                                    {stream.isActive ? 'Visible' : 'Hidden'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="flex items-center gap-1.5">
                                                <Eye className="w-4 h-4 text-gray-500" />
                                                {stream.views.toLocaleString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                                    onClick={() => router.push(`/admin/livestreams/edit/${stream._id}`)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                                    onClick={() => handleDelete(stream._id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
