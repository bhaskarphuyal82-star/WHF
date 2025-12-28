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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {liveStreams.map((stream) => (
                            <div key={stream._id} className="group bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-orange-500/50 transition-colors">
                                {/* Thumbnail */}
                                <div className="relative aspect-video bg-gradient-to-br from-orange-500/20 to-red-500/20">
                                    {stream.thumbnail ? (
                                        <img
                                            src={stream.thumbnail}
                                            alt={stream.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <Radio className="w-12 h-12 text-gray-500" />
                                        </div>
                                    )}
                                    {/* Live Indicator Overlay */}
                                    {stream.status === 'Live' && (
                                        <div className="absolute top-2 left-2">
                                            <span className="px-2 py-1 text-xs font-bold bg-red-600 text-white rounded flex items-center gap-1 shadow-lg">
                                                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                                LIVE
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="text-white font-medium line-clamp-2">{stream.title}</h3>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            {stream.location}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            {getStatusBadge(stream.status)}
                                            <span className={`px-2 py-1 text-xs font-medium rounded ${stream.isActive
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {stream.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </div>

                                    {stream.scheduledAt && stream.status === 'Scheduled' && (
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <Calendar className="w-4 h-4" />
                                            {formatDate(stream.scheduledAt)}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 text-sm text-gray-400">
                                        <Eye className="w-4 h-4" />
                                        {stream.views} views
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                            onClick={() => router.push(`/admin/livestreams/edit/${stream._id}`)}
                                        >
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                            onClick={() => handleDelete(stream._id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
