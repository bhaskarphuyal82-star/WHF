"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Play, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Video {
    _id: string;
    title: string;
    category: string;
    views: number;
    published: boolean;
    thumbnail?: string;
    videoUrl: string;
    createdAt: string;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/videos');
            const data = await response.json();
            setVideos(data.videos || []);
        } catch (error) {
            console.error('Failed to fetch videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return;

        try {
            const response = await fetch(`/api/videos/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setVideos(videos.filter(v => v._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete video:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Videos</h1>
                    <p className="text-gray-400 mt-1">Manage your video library</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/videos/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Video
                </Button>
            </div>

            {/* Videos Grid */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading videos...
                    </div>
                ) : videos.length === 0 ? (
                    <div className="p-12 text-center">
                        <Play className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No videos yet</p>
                        <Button
                            onClick={() => router.push('/admin/videos/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Your First Video
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Video</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Views</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {videos.map((video) => (
                                <tr key={video._id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 flex-shrink-0">
                                                {video.thumbnail ? (
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Play className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-white font-medium line-clamp-1">{video.title}</p>
                                                <p className="text-gray-500 text-sm line-clamp-1">{video.videoUrl}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded">
                                            {video.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${video.published
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {video.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                            <Eye className="w-4 h-4" />
                                            {video.views}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/videos/edit/${video._id}`)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(video._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
