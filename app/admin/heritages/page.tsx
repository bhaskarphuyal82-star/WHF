"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Heritage {
    _id: string;
    title: string;
    description: string;
    location?: string;
    image?: string;
    status: string;
    order: number;
}

export default function HeritagesPage() {
    const [heritages, setHeritages] = useState<Heritage[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchHeritages();
    }, []);

    const fetchHeritages = async () => {
        try {
            const response = await fetch('/api/heritages');
            const data = await response.json();
            setHeritages(data || []);
        } catch (error) {
            console.error('Failed to fetch heritages:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this heritage?')) return;

        try {
            const response = await fetch(`/api/heritages/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setHeritages(heritages.filter(h => h._id !== id));
            }
        } catch (error) {
            console.error('Failed to delete heritage:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Heritages</h1>
                    <p className="text-gray-400 mt-1">Manage heritage sites and cultural landmarks</p>
                </div>
                <Button
                    onClick={() => router.push('/admin/heritages/new')}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    New Heritage
                </Button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        Loading heritages...
                    </div>
                ) : heritages.length === 0 ? (
                    <div className="p-12 text-center">
                        <Landmark className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No heritages yet</p>
                        <Button
                            onClick={() => router.push('/admin/heritages/new')}
                            className="bg-gradient-to-r from-orange-600 to-red-600"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Heritage
                        </Button>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Heritage Info
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {heritages.map((heritage) => (
                                <tr key={heritage._id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                                {heritage.image ? (
                                                    <img src={heritage.image} alt={heritage.title} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Landmark className="w-6 h-6 text-gray-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-white font-medium">{heritage.title}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm max-w-xs truncate">
                                        {heritage.description}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                        {heritage.location || '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${heritage.status === 'Active'
                                            ? 'bg-green-500/20 text-green-400'
                                            : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {heritage.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                onClick={() => router.push(`/admin/heritages/edit/${heritage._id}`)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                onClick={() => handleDelete(heritage._id)}
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
