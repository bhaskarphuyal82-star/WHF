"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Images } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Gallery {
    _id: string;
    title: string;
    category?: string;
    coverImage?: string;
    images: any[];
    published: boolean;
    eventDate?: string;
    createdAt: string;
}

export default function GalleryPage() {
    const [galleries, setGalleries] = useState<Gallery[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchGalleries();
    }, []);

    const fetchGalleries = async () => {
        try {
            const response = await fetch('/api/gallery');
            const data = await response.json();
            setGalleries(data.galleries || []);
        } catch (error) {
            console.error('Failed to fetch galleries:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this gallery?')) return;

        try {
            const response = await fetch(`/api/gallery/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setGalleries(galleries.filter(g => g._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete gallery:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gallery</h1>
                    <p className="text-gray-400 mt-1">Manage your photo galleries</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/gallery/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Gallery
                </Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading galleries...
                    </div>
                ) : galleries.length === 0 ? (
                    <div className="p-12 text-center">
                        <Images className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No galleries yet</p>
                        <Button
                            onClick={() => router.push('/admin/gallery/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Your First Gallery
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Gallery</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Images</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {galleries.map((gallery) => (
                                <tr key={gallery._id} className="hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-orange-500/20 to-red-500/20 flex-shrink-0">
                                                {gallery.coverImage ? (
                                                    <img
                                                        src={gallery.coverImage}
                                                        alt={gallery.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <Images className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-white font-medium line-clamp-1">{gallery.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {gallery.category && (
                                            <span className="px-2 py-1 text-xs font-medium bg-purple-500/20 text-purple-400 rounded">
                                                {gallery.category}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-400">{gallery.images.length}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${gallery.published
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {gallery.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {gallery.eventDate ? format(new Date(gallery.eventDate), 'MMM dd, yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/gallery/edit/${gallery._id}`)}
                                            >
                                                <Edit className="w-4 h-4 mr-1" />
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(gallery._id)}
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
